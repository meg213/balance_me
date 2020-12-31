import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TouchableHighlight,
  Alert,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal
} from "react-native";
import {
  Icon,
  Overlay,
  Button,
  Input,
  ThemeProvider,
  ButtonGroup,
  Divider,
} from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { taskStorage } from "../backend/local_storage/taskStorage";
import { Context as AppContext } from "../context/appContext";

import Task from "../backend/model_data/Task";

const taskService = require("../backend/services/taskService");
const clone = require("rfdc")(); // Returns the deep copy function
class TaskPrompt extends Component {
  constructor(props) {
    super(props);

    var title_header = "Confirm";
    if (this.props.route.params["edit"]) {
      title_header = "Confirm Edit"
    }
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          onPress={() => {
            this.props.navigation.reset({ index: 0, routes: [{ name: "MyTasks" }] });
          }}
          name="clear"
          size={30}
          style={{ marginRight: 10 }}
        />
      ),
      title: title_header,
      headerBackTitleVisible: false,
      headerStyle: styles.HeaderStyle,
    });
    this.state = {
      // Paramaters for the task
      name: this.props.route.params["name"],
      description: this.props.route.params["description"],
      category: this.props.route.params["category"],
      time: this.props.route.params["timer"],
      value: this.props.route.params["points"],
      steps: this.props.route.params["steps"],
      selectedCategoryIndex: this.props.route.params["selectedCategoryIndex"],
      scheduledDateAndTime: this.props.route.params["timeStamp"],

      // variable for the screen updates
      date:
        this.props.route.params["timeStamp"] == null
          ? new Date()
          : this.props.route.params["timeStamp"], // temp variable to show time and date on the overlay
      tempSteps: clone(this.props.route.params["steps"]),
      mode: "date",
      show: false,
      modalDescriptionVisible: false,
      modalStepsVisible: false,
      modalScheduleVisible: false,
      modalAssignVisible: false,
      stepInput: "",
      dateSelected: true,
      selectedDayIndexes: (this.props.route.params["selected_days"] ? this.props.route.params["selected_days"] : []),
      selectedFrequencyIndex: (this.props.route.params["frequency"] ? this.props.route.params["frequency"] : -1),
      loading_icon: false,
      edit_bool: this.props.route.params["edit"],
      task: this.props.route.params['task'],
      default_bool: this.props.route.params["default"]
    };
    this.stepRef = React.createRef();
    this.Item = this.Item.bind(this);
    this.StepOverlay = this.StepOverlay.bind(this);
    this.DescriptionOverlay = this.DescriptionOverlay.bind(this);
    this.ScheduleOverlay = this.ScheduleOverlay.bind(this);
    this.getReadableDate = this.getReadableDate.bind(this);
    this.updateDayIndex = this.updateDayIndex.bind(this);
    this.updateFrequencyIndex = this.updateFrequencyIndex.bind(this);
    this.confirm = this.confirm.bind(this);

    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.weekDays = ["S", "M", "T", "W", "Th", "F", "Sa"];
    this.frequency = ["Weekly", "biweekly", "Monthly"];
  }

  async confirm() {
    this.setState({ loading_icon: true });
    const name = this.state.name;
    const value = this.state.value;
    const category = this.state.category;
    const description = this.state.description;
    const time = this.state.time;
    const steps = this.state.steps;
    const date = (this.state.scheduledDateAndTime) ? (this.state.scheduledDateAndTime) : new Date();

    let days = [];
    let frequency = [];
    this.state.selectedDayIndexes.forEach((item, index) => {
      days.push(this.weekDays[item]);
    });

    if (this.state.selectedFrequencyIndex >= 0) {
      frequency.push(this.frequency[this.state.selectedFrequencyIndex]);
    }
    let { state } = this.context;

    if (this.state.edit_bool) {
      var data = {
        name: name,
        description: description,
        estimated_time: time * 60,
        category_id: this.state.selectedCategoryIndex,
        point_value: value,
        steps: JSON.stringify(steps),
        start_time: date.getTime() / 1000,
        repeat: {
          days: days,
          frequency: frequency
        },
        estimated_completion_time: (date.getTime() / 1000) + (time * 60)
      }
      var task = await taskService.updateTask(this.state.task.id, data) 
    } else {
      var status_var = (this.state.scheduledDateAndTime) ? 2 : 1;
      var task = await taskService.createTask(
        this.state.name,
        this.state.value,
        this.state.selectedCategoryIndex,
        this.state.time * 60,
        this.state.description,
        null,
        null,
        status_var,
        "none",
        state.user.id,
        state.user.id
      );
  
      var new_task = new Task(
        task.task_id,
        task.name,
        task.point_value,
        task.category_id,
        task.estimated_time,
        task.description,
        task.start_time,
        task.estimated_completion_time,
        task.status,
        task.completion_time,
        task.image_path,
        task.assigned_user_id,
        task.created_user_id,
        task.history,
        task.repeat,
        task.completed,
        task.active,
        task.steps
      );
  
      const repeat = { days: days, frequency: frequency };
      if (date) {
        await new_task.updateStartTime(date.getTime() / 1000);
      }
      await new_task.updateStepsAndRepeat(JSON.stringify(steps), repeat);
  
      // alert(`
      // name: ${name}\n
      // value: ${value}\n
      // category: ${category}\n
      // description: ${description}\n
      // time: ${time}\n
      // steps: ${JSON.stringify(steps)}\n
      // date: ${date}\n
      // repeat: ${JSON.stringify(repeat)}
      // `);
      if (!this.state.default_bool) {
        await taskStorage.addTaskIntoCateogry(
          {
            name: new_task.name,
            description: new_task.description,
            steps: new_task.steps,
            estimated_time: new_task.estimated_time,
            category_id: new_task.category_id,
            point_value: new_task.point_value
          },
          this.state.category
        );
      }
    }
    // remove before production
    // taskStorage.printCategory(this.state.category);
    this.props.navigation.reset({ index: 0, routes: [{ name: "MyTasks" }] });
    this.setState({ loading_icon: false });
  }

  updateDayIndex(selectedDayIndexes) {
    this.setState({ selectedDayIndexes: selectedDayIndexes.sort() });
  }
  updateFrequencyIndex(selectedFrequencyIndex) {
    if (selectedFrequencyIndex == this.state.selectedFrequencyIndex) {
      this.setState({ selectedFrequencyIndex: -1 });
    } else {
      this.setState({ selectedFrequencyIndex });
    }
  }

  getReadableDate(type, date) {
    let dateFormat = `${
      this.monthNames[date.getMonth()]
      } ${this.state.date.getDate()}, ${date.getFullYear()}`;

    if (type == "date") {
      return dateFormat;
    }
    let timeFormat;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    timeFormat = hours + ":" + minutes + " " + ampm;
    if (type == "time") {
      return timeFormat;
    }

    return `${dateFormat} ${timeFormat}`;
  }

  render() {
    var loading_icon = <Modal
      transparent={true}
      animationType={'none'}
      visible={true}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size={Platform.OS == "ios" ? "large" : 50}
            color="#37C1FF"
          />
        </View>
      </View>
    </Modal>;

    return (
      <View style={styles.Background}>
        {(this.state.loading_icon) ? loading_icon : null}
        <View style={styles.BasicInformationContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.Title} numberOfLines={1}>
              {this.state.name}
            </Text>
            <View style={[styles.pop, styles.ValueCountContainer]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="stars"
                  size={40}
                  color="gold"
                  underlayColor="black"
                  iconStyle={styles.GoldIconStyle}
                />
                <Text style={styles.PointValue}>{this.state.value}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="alarm"
                  size={40}
                  color="gold"
                  underlayColor="black"
                  iconStyle={styles.GoldIconStyle}
                />
                <Text style={styles.PointValue}>{this.state.time}</Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {this.state.category}
          </Text>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginTop: 5,
            }}
          >
            <Text style={styles.Body} numberOfLines={6}>
              {this.state.description}
            </Text>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ modalDescriptionVisible: true });
              }}
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.FullDescription}>
                See Full Description...
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.OptionalInformationContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Divider
              style={{ flex: 1, height: 1, backgroundColor: "#b5b5b5" }}
            />
            <Text style={{ color: "#b5b5b5", fontWeight: "bold" }}>
              {" "}
              Optional{" "}
            </Text>
            <Divider
              style={{ flex: 1, height: 1, backgroundColor: "#b5b5b5" }}
            />
          </View>
          {/* =================== Add steps for the task =================== */}
          <View style={[styles.pop, styles.OptionalInput]}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon reverse name="list" size={25} />
            </View>
            <View style={{ flex: 3 }}>
              <Button
                title="Add Steps"
                containerStyle={([styles.pop], { borderRadius: 10 })}
                onPress={() => {
                  this.setState({ modalStepsVisible: true });
                }}
              />
            </View>
          </View>
          {/* =================== Schedule task =================== */}
          <View style={[styles.pop, styles.OptionalInput]}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon reverse name="schedule" size={25} />
            </View>
            <View style={{ flex: 3 }}>
              <Button
                title={
                  this.state.scheduledDateAndTime == null
                    ? "Schedule Task"
                    : this.getReadableDate(
                      "both",
                      this.state.scheduledDateAndTime
                    )
                }
                containerStyle={([styles.pop], { borderRadius: 10 })}
                onPress={() => {
                  this.setState({ modalScheduleVisible: true });
                }}
              />
            </View>
          </View>
          {/* =================== assign task to another person =================== */}
          <View style={[styles.pop, styles.OptionalInput]}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon reverse name="person-add" size={25} />
            </View>
            <View style={{ flex: 3 }}>
              <Button
                title="Assign Task"
                containerStyle={([styles.pop], { borderRadius: 10 })}
                onPress={() => {
                  alert("In development");
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.ConfirmationContainer}>
          <Button
            icon={<Icon raised name="check" size={15} color="blue" />}
            title="Confirm"
            containerStyle={([styles.pop], { borderRadius: 10, width: "80%" })}
            onPress={this.confirm}
          />
        </View>

        {/* Modal to show full descrtion */}
        <this.DescriptionOverlay
          title="Task Description"
          subtext={this.state.description}
        />
        {/* Modal to show steps */}
        <this.StepOverlay />

        {/* Modal to schedule task */}
        <this.ScheduleOverlay />
      </View>
    );
  }

  DescriptionOverlay({ title, subtext }) {
    return (
      <Overlay
        isVisible={this.state.modalDescriptionVisible}
        onBackdropPress={() => {
          this.setState({
            modalDescriptionVisible: !this.state.modalDescriptionVisible,
          });
        }}
        animationType="fade"
        overlayStyle={styles.modalView}
      >
        <View>
          <Text style={styles.SubHeading}>{title}</Text>
          <Text style={styles.modalText}>{subtext}</Text>
        </View>
      </Overlay>
    );
  }

  StepOverlay() {
    return (
      <Overlay
        isVisible={this.state.modalStepsVisible}
        onBackdropPress={() => {
          this.setState({
            modalStepsVisible: !this.state.modalStepsVisible,
            tempSteps: clone(this.state.steps),
          });
        }}
        animationType="fade"
        overlayStyle={[styles.modalView, { width: "80%" }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ minWidth: "75%", width: '100%', height: '100%' }}
        >
          <Text style={styles.SubHeading}>Steps</Text>
          <View>
            <Input
              multiline={true}
              ref={this.stepRef}
              placeholder="Add Step"
              onChangeText={(value) =>
                this.setState({ stepInput: value.trim() })
              }
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              rightIcon={
                <Icon
                  name="add-circle-outline"
                  size={30}
                  onPress={() => {
                    if (this.state.stepInput.length == 0) {
                      this.stepRef.current.shake();
                    } else {
                      let stepTemp = this.state.tempSteps;
                      let data = { description: this.state.stepInput };
                      stepTemp.push(data);
                      this.setState({ tempSteps: stepTemp, stepInput: "" });
                    }
                    this.stepRef.current.clear();
                  }}
                />
              }
            />
          </View>
          <FlatList
            data={this.state.tempSteps}
            renderItem={({ item, index }) => (
              <this.Item title={item.description} index={index} />
            )}
            keyExtractor={(item) => item.id}
            extraData={this.state.tempSteps}
          />
          <Button
            raised={true}
            title="Update"
            onPress={() => {
              this.setState({
                modalStepsVisible: !this.state.modalStepsVisible,
                steps: clone(this.state.tempSteps),
              });
            }}
          />
        </KeyboardAvoidingView>
      </Overlay>
    );
  }

  Item({ title, index }) {
    return (
      <View style={[styles.pop, styles.item]}>
        <View style={{ flex: 0.8, borderRightWidth: 0.5, paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 12, textAlign: "center" }}>Step</Text>
          <Text style={styles.StepText}>{index}</Text>
        </View>
        <View style={{ flex: 3, paddingLeft: 5 }}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="green"
            onPress={() => {
              Alert.alert("Task Description", title);
            }}
          >
            <Text numberOfLines={1} style={styles.StepText}>
              {title}
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1 }}>
          <Icon
            reverse
            name="delete"
            size={15}
            onPress={() => {
              let arr = this.state.tempSteps;
              arr.splice(index, 1);
              this.setState({ tempSteps: arr });
            }}
          />
        </View>
      </View>
    );
  }
  ScheduleOverlay() {
    return (
      <Overlay
        isVisible={this.state.modalScheduleVisible}
        onBackdropPress={() => {
          this.setState({
            modalScheduleVisible: !this.state.modalScheduleVisible,
          });
        }}
        animationType="fade"
        overlayStyle={[
          styles.modalView,
          { flex: 1, width: "80%", minHeight: "80%" },
        ]}
      >
        <Text style={styles.SubHeading}>Schedule Task</Text>
        <View
          style={{
            flex: 1.5,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[
              styles.pop,
              {
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
                margin: 10,
                borderRadius: 25,
                borderWidth:
                  this.state.dateSelected == true &&
                    (Platform.OS == "ios" ? true : this.state.show)
                    ? 1
                    : 0,
              },
            ]}
            onPress={() => this.setState({ dateSelected: true, show: true })}
          >
            <Icon name="today" size={30} />
            <Text style={{ textAlign: "center" }}>
              {this.getReadableDate("date", this.state.date)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pop,
              {
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
                margin: 10,
                borderRadius: 25,
                borderWidth:
                  this.state.dateSelected == false &&
                    (Platform.OS == "ios" ? true : this.state.show)
                    ? 1
                    : 0,
              },
            ]}
            onPress={() => this.setState({ dateSelected: false, show: true })}
          >
            <Icon name="schedule" size={30} />
            <Text style={{ textAlign: "center" }}>
              {this.getReadableDate("time", this.state.date)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 3, width: "100%" }}>
          {(Platform.OS == "ios" ? true : this.state.show) && (
            <DateTimePicker
              // testID="dateTimePicker"
              value={this.state.date}
              mode={this.state.dateSelected == true ? "date" : "time"}
              display="spinner"
              onChange={(event, selectedDate) => {
                console.log(event);
                if (Platform.OS == "android") {
                  this.setState({ show: false });
                }
                const currentDate = selectedDate || this.state.date;
                this.setState({ date: currentDate });
              }}
            />
          )}
        </View>

        <View style={{ flex: 2.5, width: "100%", marginTop: 5 }}>
          <Text style={styles.SubHeading}>Repeat</Text>
          <Text>Days</Text>
          <ButtonGroup
            selectMultiple={true}
            onPress={this.updateDayIndex}
            selectedIndexes={this.state.selectedDayIndexes}
            buttons={this.weekDays}
            containerStyle={{ flex: 1, borderRadius: 10 }}
            textStyle={{ fontWeight: "bold" }}
          />

          <Text>Frequency</Text>
          <ButtonGroup
            onPress={this.updateFrequencyIndex}
            selectedIndex={this.state.selectedFrequencyIndex}
            buttons={this.frequency}
            containerStyle={{ flex: 1, borderRadius: 10 }}
            textStyle={{ fontWeight: "bold" }}
          />
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end", width: "100%" }}>
          <Button
            raised={true}
            title="Schedule Task"
            onPress={() => {
              this.setState({
                scheduledDateAndTime: this.state.date,
                modalScheduleVisible: !this.state.modalScheduleVisible,
              });
            }}
          />
        </View>
      </Overlay>
    );
  }
}
TaskPrompt.contextType = AppContext;
const styles = StyleSheet.create({
  HeaderStyle: {
    backgroundColor: "#F2CD5C",
  },
  Background: {
    flex: 2,
    minHeight: 550,
    backgroundColor: "white",
  },
  BasicInformationContainer: {
    flex: 6,
    backgroundColor: "#F2CD5C",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 15,
  },
  Title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textDecorationLine: "underline",
  },
  SubHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#55A61C",
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  Body: {
    fontSize: 15,
    letterSpacing: 1,
    textAlign: "justify",
    flex: 1,
  },
  FullDescription: {
    letterSpacing: 1,
    fontWeight: "500",
    textAlign: "center",
    textAlignVertical: "center",
    color: "blue",
    textDecorationLine: "underline",
  },
  OptionalInformationContainer: {
    flex: 12,
    backgroundColor: "white",
  },
  OptionalInput: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    paddingRight: "10%",
  },
  item: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '95%',
    margin: 6
  },
  StepText: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
  },
  ConfirmationContainer: {
    flex: 3,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  PointContainer: {
    flex: 2,
    margin: 10,
    width: "95%",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fcfbe8",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,

    elevation: 5,
  },
  ValueCountContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F2CD5C",
  },
  PointValue: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    textDecorationStyle: "solid",
    textDecorationColor: "black",
    color: "#b89d0b",
  },
  GoldIconStyle: {
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  pop: {
    backgroundColor: "white",
    borderRadius: 50,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,

    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    maxHeight: "90%",
    maxWidth: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "justify",
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
export default TaskPrompt;
