import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, SafeAreaView } from 'react-native';
import Card from './../components/card.js';
import Stepper from './../components/stepper.js'
import 'react-native-gesture-handler';
import { taskStorage } from './../backend/local_storage/taskStorage'

import Default_Task from './../components/default_task'
import { Icon } from 'react-native-elements';

//TODO: send "individual" as group preference to chooseTask
class DefaultTaskList extends Component {
    constructor(props) {
        super(props);
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
            title: "",
            headerBackTitleVisible: false,
            headerLeftContainerStyle: { marginLeft: 5 },
        });

        this.state = {
            title: '',
            category: this.props.route.params.category,
            tasks: []
        }

        if (this.state.category == 0) {
            this.state.tasks = taskStorage.getCategory('Health');
            this.state.title = "Health"
        } else if (this.state.category == 1) {
            this.state.tasks = taskStorage.getCategory('Home');
            this.state.title = "Home"
        } else if (this.state.category == 2) {
            this.state.tasks = taskStorage.getCategory('School');
            this.state.title = "School"
        } else {
            this.state.tasks = taskStorage.getCategory('Other');
            this.state.title = "Other"
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.mainText}>Let's create a task:</Text>
                        <Stepper step={3} />
                    </View>
                    <View style={styles.selection}>
                        <Text style={styles.titleText}>{this.state.title}</Text>
                        {/* <Default_Task></Default_Task> */}
                        {this.createTasks()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    createTasks = () => {
        var taskList = this.state.tasks;
        if (taskList.length == 0) {
            return (
                <View style={styles.noTasks}>
                    <Text style={{ color: "red" }}>There are no tasks for this category!</Text>
                </View>
            )
        }
        const TaskList = taskList.map((task, index) => {
            return (
                <Default_Task
                    key={index}
                    name={task.name}
                    point_value={task.point_value}
                    onPress={
                        () => {
                            this.props.navigation.navigate("CustomTask", {
                                task: { task },
                                default: true
                            })
                        }
                    }
                />
            )
        })
        return (
            TaskList
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCFCFC",
    },
    headerContainer: {
        flex: 1,
        backgroundColor: "#FCFCFC",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    selection: {
        backgroundColor: '#FBF5E4',
        alignItems: 'center',
        width: '100%',
        minHeight: 400,
        marginTop: 40,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    cards: {
        flexDirection: 'row',
        marginTop: 24,
        alignItems: 'center'
    },
    mainText: {
        fontSize: 32,
        paddingBottom: 50,
        paddingTop: 50,
        color: "#F2CD5C",
        fontWeight: 'bold'
    },
    titleText: {
        fontSize: 36,
        fontWeight: 'bold',
        padding: 24,
    },
    noTasks: {
        color: "red",
        alignItems: 'center'
    }

});
export default DefaultTaskList;
