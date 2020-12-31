import React, { Component } from "react";
import { View, Button, StyleSheet, Text } from "react-native";

import PrimaryButton from "./../components/button.js";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

// input: title, description, estimated time, points, scheduled timestamp
class TaskDetail extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerRight: () => (
        <Button onPress={this.editTask} title="Edit" color="black" />
      ),
      headerStyle: styles.HeaderStyle,
    });

    this.state = {
      task: this.props.route.params['task']
    }
    console.log(this.state.task)

    this.editTask = this.editTask.bind(this);
    this.startTask = this.startTask.bind(this);
    this.fullDescription = this.fullDescription.bind(this);
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {/*======================= Title and timer containter =======================*/}
        <View style={styles.TopContainer}>
          <View
            style={{ flex: 4, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={styles.TaskTitle}>{this.state.task.name}</Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 5,
              borderLeftColor: "black",
              borderLeftWidth: 2,
            }}
          >
            <Text style={styles.TimeTitle}>Time</Text>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Text style={styles.Time}>{this.state.task.estimated_time / 60}</Text>
            </View>
          </View>
        </View>

        {/* ======================= Description Containter =======================*/}
        <View style={styles.DesriptionContainer}>
          <View style={styles.PopBackground}>
            <Text style={styles.SubHeading}>Description</Text>
            <Text style={styles.Body}>{this.state.task.description}</Text>
            <TouchableWithoutFeedback onPress={this.fullDescription}>
              <Text style={styles.FullDescription}>
                See Full Description...
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* ======================= Schedule Container =======================*/}
        <View style={styles.ScheduleContainer}>
          <View style={[styles.PopBackground, { flexDirection: "row" }]}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={[styles.SubHeading, { textAlign: "center" }]}>
                Scheduled For
              </Text>
              <View
                style={{
                  flex: 2,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text style={styles.CenterTimeStamp}>
                  {this.timeToString(this.state.task.start_time)}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, borderLeftWidth: 2 }}>
              <Text style={[styles.SubHeading, { textAlign: "center" }]}>
                Points
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text style={styles.Points}>{this.state.task.point_value}</Text>
              </View>
            </View>
          </View>
          {((!this.state.task.completed) && ((this.state.task.status == 2) || (this.state.task.status == 0))) ? <PrimaryButton
            text="Start Now"
            color="#A1D991"
            onPress={this.startTask}
          /> : null}
        </View>
      </View>
    );
  }

  editTask() {
    this.props.navigation.navigate("CustomTask", {
      task: {'task': this.state.task},
      edit: true
    })
  }
  fullDescription() {
    alert(this.state.task.description);
  }
  startTask() {
    alert("Task started at " + this.state.task.start_time);
  }
  timeToString = (time) => {
    var data = new Date(time * 1000 )
    var hours = data.getHours() % 12 || 12;
    var minutes = data.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
      } else {
      minutes = minutes + '';
      }
    var time_stamp = (data.getHours() >= 12) ? 'PM' : 'AM';
    var month = data.toLocaleString('default', { month: 'long' })
    var day = data.getDay();
    var year = data.getFullYear();
    var str = hours + ":" + minutes + " " + time_stamp + " on " + month + " " + day + ", " + year;
    return str;
  }
}

const styles = StyleSheet.create({
  TopContainer: {
    backgroundColor: "#F2CD5C",
    flex: 1,
    flexDirection: "row",
    paddingTop: 5,
  },
  DesriptionContainer: {
    backgroundColor: "white",
    flex: 2,
  },
  ScheduleContainer: {
    backgroundColor: "white",
    flex: 2,
    alignItems: "center",
  },

  HeaderStyle: {
    backgroundColor: "#F2CD5C",
  },
  SubHeading: {
    fontSize: 20,
    fontWeight: "500",
    padding: 5,
    textDecorationLine: "underline",
    textTransform: "uppercase",
  },
  Body: {
    fontSize: 15,
    letterSpacing: 1,
    textAlign: "justify",
    padding: 5,
    flex: 1,
  },
  CenterTimeStamp: {
    fontSize: 15,
    letterSpacing: 1,
    textAlign: "justify",
    padding: 5,
  },
  FullDescription: {
    letterSpacing: 1,
    fontWeight: "500",
    textAlign: "center",
    color: "blue",
    textDecorationLine: "underline",
  },

  TaskTitle: {
    fontSize: 42,
    fontWeight: "700",
    color: "white",
    padding: 5,
  },
  Time: {
    fontSize: 30,
    fontWeight: "700",
  },
  TimeTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },

  PopBackground: {
    margin: 10,
    padding: 15,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,

    elevation: 5,
  },

  Points: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 50,
    fontWeight: "700",
    color: "gold",
  },
});

export default TaskDetail;
