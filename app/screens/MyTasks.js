import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import Task from './../components/task';
import PrimaryButton from './../components/button';
import PropTypes from 'prop-types';
import Tabbar from './../components/tabbar';

import moment from 'moment';

import { Context as AppContext } from '../context/appContext';
const taskService = require("../backend/services/taskService");
const task = require("./../backend/model_data/Task");
//create task components out of tasks, render a form page out of that info
let navigation;
class MyTasks extends Component {
  constructor(props) {
    super(props);
    navigation = this.props.navigation;
    var state = {
      loading_icon: false
    };
  }

  UNSAFE_componentWillMount() {
    let { state } = this.context;
    this.setState({ daily_tasks: state.daily_tasks, points: this.context.state.user.points })
  }

  minuteUpdateDailyTasks = async () => {
    this.setState({ loading_icon: true })
    await this.context.minuteUpdateDailyTasks(this.context.state.user.email);
    // await this.context.fetchDailyTasks(this.context.state.user.email);
    this.setState({ daily_tasks: this.context.state.daily_tasks, points: this.context.state.user.points })
    this.setState({ loading_icon: false })
  }

  async componentDidMount() {
    this.setState({ loading_icon: true })
    await this.context.minuteUpdateDailyTasks(this.context.state.user.email);
    this.interval = setInterval(this.minuteUpdateDailyTasks, 30 * 1000);
    this.setState({ daily_tasks: this.context.state.daily_tasks, loading_icon: false, points: this.context.state.user.points })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    var loading_icon = <ActivityIndicator
      size={Platform.OS == "ios" ? "large" : 50}
      color="#37C1FF"
    />;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ flex: 1, padding: 12, paddingTop: '10%' }} refreshControl={
          <RefreshControl refreshing={this.state.loading_icon} onRefresh={() => this.minuteUpdateDailyTasks()} tintColor="#37C1FF" />
        }>
          <Text style={styles.myTask}>Today's Tasks</Text>
          <Text style={styles.date}>
            {getDayOfWeek() + ", " + getMonthofYear() + " " + getDay()}
          </Text>
          <Text style={styles.progress}>Points Earned: {this.state.points}</Text>

          {/* {(this.state.loading_icon) ? loading_icon : null} */}
          {this.state.daily_tasks ? this.addTasks(this.state.daily_tasks) : noTasks()}
        </ScrollView>
        <Tabbar
          taskPress={() => {
            this.props.navigation.navigate("MyTasks");
          }}
          addPress={() => {
            this.props.navigation.navigate("CreateTask");
          }}
          profilePress={() => {
            this.props.navigation.reset({ index: 0, routes: [{ name: "ProfileScreen" }] });
          }}
        />
      </SafeAreaView>
    );
  }

  // FOR MORGAN: THIS IS UPDATES THE 5 TASKS ASSIGNED TO YOU UPDATE TO TODAY'S TIMES
  updateAllTasksToToday = async () => {
    await updateAllTasksToToday();
    await this.context.minuteUpdateDailyTasks(this.context.state.user.email);
    this.setState({ daily_tasks: this.context.state.daily_tasks })
  }

  async callback() {
    this.setState({ loading_icon: true })
    await this.context.minuteUpdateDailyTasks(this.context.state.user.email);
    this.setState({ daily_tasks: this.context.state.daily_tasks, points: this.context.state.user.points })
    this.setState({ loading_icon: false })
  }

  // creates a section of tasks with a title and list of tasks, if the array is not empty
  createTasks = (taskList, text) => {
    const TaskList = taskList.map((task, index) => {
      return (
        <View key={index} style={{ paddingVertical: 3 }}>
          <Task
            id={task.id}
            completed={task.completed}
            status={task.status}
            name={task.name}
            point_value={task.point_value}
            time={(task.start_time) ? getTime(task.start_time) : 'null'}
            onPress={
              () => {
                navigation.navigate("TaskStatus", {
                  task: { task },
                  callback: this.callback.bind(this)
                });
              }
            }
            quickComplete={async () => {
              await this.context.state.user.updatePoints(this.context.state.user.points + task.point_value);
              await task.setComplete(true);
              this.minuteUpdateDailyTasks()
            }
            }
          />
        </View>
      )
    })
    return (
      (taskList.length != 0) ?
        (<View>
          <Text style={styles.progress}>{text}</Text>
          {TaskList}
        </View>)
        : null
    );
  }

  //breaks down the tasks array into sections
  addTasks = (tasks) => {
    //get completed tasks
    const complete = tasks.filter((task) => task.completed);

    // get incomplete tasks
    const incomplete = tasks.filter((task) => !task.completed);

    //get each incomplete task type
    const overdue = incomplete.filter(task => task.status === 0);
    const inProgress = incomplete.filter(task => task.status === 1);
    const upcoming = incomplete.filter(task => task.status === 2);
    const missed = incomplete.filter(task => task.status === 3);

    return (
      <View style={{ marginBottom: 45 }}>
        {this.createTasks(overdue, "Overdue")}
        {this.createTasks(inProgress, "In Progress")}
        {this.createTasks(upcoming, "Upcoming")}
        {this.createTasks(complete, "Completed")}
        {this.createTasks(missed, "Missed")}
      </View>
    )
  }
}
MyTasks.contextType = AppContext;

const getTime = (time) => { 
  var newTime = moment(new Date(time * 1000)).format('hh:mm');
  return newTime;
}
// functions about getting the date
const getDay = () => {
  return new Date().getDate();
}
const getDayOfWeek = () => {
  const dayOfWeek = new Date().getDay();
  return isNaN(dayOfWeek)
    ? null
    : [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayOfWeek];
};
const getMonthofYear = () => {
  const month = new Date().getMonth();
  return isNaN(month)
    ? null
    : [
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
    ][month];
};

//if there are no tasks
const noTasks = () => {
  return (
    <View style={styles.noTasks}>
      <Text style={styles.noTaskText}>
        It looks like you don't have any tasks for today!
      </Text>
    </View>
  );
};

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  myTask: {
    fontSize: 36,
    fontWeight: "bold",
    paddingBottom: 6,
    paddingTop: 6,
  },
  date: {
    padding: 6,
    fontWeight: "200",
    fontSize: 18,
    paddingBottom: 24,
  },
  progress: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 6,
  },
  tasks: {},
  noTasks: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  noTaskText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    padding: 6,
  }
});

/*
 Props:
    tasks: An array of task data to create task objects
*/
// MyTasks.propTypes = {
//   tasks: PropTypes.array,
// };

// // what will the default be if none is specified
// MyTasks.defaultProps = {
//   tasks: [
//     {
//       id: 1,
//       title: 'Status 1',
//       description: 'description here',
//       completed: false,
//       estimatedTime: 4,
//       point_value: 10,
//       img: './../assets/url',
//       date: '06-19-2020 9:00am',
//       status: 1
//     },
//   ]
//   // tasks: null (uncomment to see noTasks() method run)
// }

const updateAllTasksToToday = async () => {
  //4:00 AM
  var today = new Date();
  today.setHours(4, 0, 0, 0);
  var four_am = (today.getTime() / 1000);
  //Noon
  today = new Date();
  today.setHours(12, 0, 0, 0);
  var noon = (today.getTime() / 1000);
  //11:00 PM
  var today = new Date();
  today.setHours(23, 0, 0, 0);
  var eleven_pm = (today.getTime() / 1000);

  var completed_data = {
    start_time: four_am,
    estimated_completion_time: (four_am + 300),
    status: 2,
    completed: true
  }
  var task_completed = await taskService.updateTask("5ef3a995f7c61b000425866f", completed_data).then(task => { return task; }); //updates completed task

  var upcoming_data = {
    start_time: eleven_pm,
    estimated_completion_time: (eleven_pm + 300),
    status: 2,
    completed: false
  }
  var task_upcoming = await taskService.updateTask("5ef3a9f5f7c61b0004258670", upcoming_data).then(task => { return task; }); //updates upcoming task

  var missed_data = {
    start_time: four_am,
    estimated_completion_time: (four_am + 300),
    status: 2,
    completed: false
  }
  var task_missed = await taskService.updateTask("5ef3aa85f7c61b0004258671", missed_data).then(task => { return task; }); //updates missed task

  var overdue_data = {
    start_time: four_am,
    estimated_completion_time: (four_am + 300),
    status: 2,
    completed: false
  }
  var task_overdue = await taskService.updateTask("5ef3aeaec70210000476190d", overdue_data).then(task => { return task; }); //updates overdue task

  var in_progress_data = {
    start_time: noon,
    estimated_completion_time: (noon + 300),
    status: 2,
    completed: false
  }
  var task_in_progress = await taskService.updateTask("5ef3afffc70210000476190e", in_progress_data).then(task => { return task; }); //updates in_progress task
}

export default MyTasks;
