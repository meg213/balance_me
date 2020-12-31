import React, { Component } from "react";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import {
  Input,
  Button as BTN,
  Icon,
  ButtonGroup,
  Slider,
} from "react-native-elements";

import { Context as AppContext } from "../context/appContext";
import Task from "../backend/model_data/Task";

const taskService = require("../backend/services/taskService");

class CustomTask extends Component {
  constructor(props) {
    super(props);

    var title_header = "Create New Task "
    if (this.props.route.params) {
      if (this.props.route.params.edit) {
        title_header = "Edit Task "
      }
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

    this.categoryButtons = ["Health", "Home", "School", "Other"];
    this.weekDaysButtons = ["S", "M", "T", "W", "T", "F", "S"];
    this.updateCategoryIndex = this.updateCategoryIndex.bind(this);
    this.checkInputs = this.checkInputs.bind(this);
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.estimateRef = React.createRef();
    this.state = {
      selectedCategoryIndex: 3,
      name: null,
      description: null,
      category: "Other",
      time: null,
      value: 5,
      steps: []
    };

    if (this.props.route.params) {
      if (this.props.route.params.task) {
        var task = this.props.route.params.task.task;
        this.state.task = task;
        this.state.name = task.name;
        this.state.description = task.description;
        this.state.value = task.point_value;
        this.state.time = (task.estimated_time / 60).toString();
        this.state.selectedCategoryIndex = task.category_id;
        this.state.steps = task.steps;
        this.state.category = this.categoryButtons[task.category_id];
        this.state.start_time = task.start_time;
        if (task.repeat) {
          this.state.repeat_days = task.repeat.days;
          this.state.repeat_freq = task.repeat.frequency;
        }
      }
      if (this.props.route.params.edit) {
        this.state.edit_bool = this.props.route.params.edit;
      }
      if (this.props.route.params.default) {
        this.state.default_bool = this.props.route.params.default;
      }
    }
  }

  async checkInputs() {
    let ref = null;
    if (this.state.name == null || this.state.name.length == 0) {
      ref = this.nameRef;
    }
    if (this.state.description == null || this.state.description.length == 0) {
      if (ref == null) {
        ref = this.descriptionRef;
      } else {
        this.descriptionRef.current.shake();
      }
    }
    if (this.state.time == null || this.state.time == "0") {
      if (ref == null) {
        ref = this.estimateRef;
      } else {
        this.estimateRef.current.shake();
      }
    }

    if (ref != null) {
      ref.current.shake();
      ref.current.clear();
      ref.current.focus();
    } else {
      var current_time = Math.round(Date.now() / 1000);

      // alert(
      //   `Name:${this.state.name}
      //   Description:${this.state.description}
      //   Time Estimate:${this.state.time}
      //   Category:${this.state.category}
      //   Point Value:${this.state.value}`
      // );
      var weekDays = ["S", "M", "T", "W", "Th", "F", "Sa"];
      var frequency = ["Weekly", "biweekly", "Monthly"];
      var weekDays_submit = [];
      if (this.state.repeat_days) {
        weekDays.forEach((item, index) => {
          if (this.state.repeat_days.includes(item)) {
            weekDays_submit.push(index)
          }
        });
      }
      var frequency_submit = -1;
      if (this.state.repeat_freq) {
        frequency.forEach((item, index) => {
          if (this.state.repeat_freq.includes(item)) {
            frequency_submit = index
          }
        });
      }

      this.props.navigation.navigate("TaskPrompt", {
        name: this.state.name.trim(),
        timer: this.state.time,
        description: this.state.description.trim(),
        points: this.state.value,
        category: this.state.category,
        selectedCategoryIndex: this.state.selectedCategoryIndex,
        steps: (this.state.edit_bool) ? JSON.parse(this.state.steps) : this.state.steps,
        timeStamp: (this.state.start_time) ? new Date(this.state.start_time * 1000) : null,
        selected_days: weekDays_submit,
        frequency: frequency_submit,
        edit: this.state.edit_bool,
        task: this.state.task,
        default: this.state.default_bool
      });
    }
  }

  updateCategoryIndex(selectedCategoryIndex) {
    this.setState({
      selectedCategoryIndex,
      category: this.categoryButtons[selectedCategoryIndex],
    });
  }

  render() {
    const { selectedCategoryIndex } = this.state;
    return (
      <View style={styles.background}>
        <View style={styles.form}>
          <Input
            ref={this.nameRef}
            placeholder="Enter a name for the task"
            label="Name"
            onChangeText={(value) => this.setState({ name: value })}
            containerStyle={styles.InputContainer}
            labelStyle={styles.labelText}
            maxLength={15}
            value={(this.state.name) ? (this.state.name) : ""}
          />
          <Input
            ref={this.descriptionRef}
            placeholder="Enter a description of the task"
            label="Description"
            onChangeText={(value) =>
              this.setState({ description: value })
            }
            containerStyle={styles.InputContainer}
            labelStyle={styles.labelText}
            maxLength={250}
            value={(this.state.description) ? (this.state.description) : ""}
          />

          <Input
            ref={this.estimateRef}
            placeholder="Enter the time in mins"
            label="Time Estimate (Mins)"
            onChangeText={(value) => this.setState({ time: value })}
            containerStyle={styles.InputContainer}
            keyboardType="number-pad"
            returnKeyLabel="Done"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            labelStyle={styles.labelText}
            maxLength={3}
            value={(this.state.time) ? (this.state.time) : ""}
          />
          <View style={styles.InputContainer}>
            <Text style={[styles.labelText, { marginLeft: 5, padding: 5 }]}>
              Category
          </Text>
            <ButtonGroup
              onPress={this.updateCategoryIndex}
              selectedIndex={selectedCategoryIndex}
              buttons={this.categoryButtons}
              containerStyle={{ flex: 1 }}
            />
          </View>

          <View style={styles.PointContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.labelText, { marginBottom: "5%" }]}>
                Point Value
            </Text>
              <View style={styles.ValueCountContainer}>
                <Icon
                  name="stars"
                  size={30}
                  // style={{ marginRight:  }}
                  color="gold"
                  underlayColor="black"
                  iconStyle={styles.GoldIconStyle}
                />
                <Text style={styles.PointValue}>{this.state.value}</Text>
              </View>
            </View>
            <Slider
              value={this.state.value}
              onValueChange={(value) => this.setState({ value })}
              maximumValue={50}
              minimumValue={1}
              thumbTintColor='#1D76AA'
              step={1}
            />
          </View>

          {/* Time picker will go here
        <View style={{ flex: 2 }}></View> */}
        </View>
        <View style={styles.ButtonContainer}>
          <BTN raised={true} title="Create Task" onPress={this.checkInputs} style={{ width: 300 }} />
        </View>
      </View>
    );
  }
}
CustomTask.contextType = AppContext;
const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFF9F3',
    flex: 1,
    padding: 18,
  },
  form: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    borderRadius: 10,
  },
  HeaderStyle: {
    backgroundColor: "#F2CD5C",
  },
  InputContainer: {
    flex: 1,
    marginTop: 12,
    width: "100%",
  },
  PointContainer: {
    margin: 10,
    width: "100%",
    justifyContent: "center",
    padding: 12,
  },
  ValueCountContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F2CD5C",
  },
  ButtonContainer: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center'
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#606060",
  },
  PointValue: {
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
    textDecorationStyle: "solid",
    textDecorationColor: "black",
    color: "#b89d0b",
  },
  GoldIconStyle: {
    marginRight: 5,
  },
});
export default CustomTask;
