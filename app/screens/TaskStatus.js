import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Button, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import PrimaryButton from './../components/button';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { Context as AppContext } from '../context/appContext';
const task = require("./../backend/model_data/Task");

const types = [
    { // overdue
        backgroundColor: '#ffb3a7', // original: backgroundColor: '#FEEDEA',
        body: "Your Task is overdue!",
        color: '#F24822',
        buttonText: 'Start Task'
    },
    { // in progress
        backgroundColor: '#ECF9FF',
        body: "Your Task is in progress",
        color: '#1D76AA',
        buttonText: 'Complete Task'
    },
    { // complete
        backgroundColor: '#FCF5DE',
        body: "Your Task is upcoming!",
        color: '#F2CD5C',
        buttonText: 'Start Task'
    },
    { // missed
        backgroundColor: '#F2F2F2',
        body: "You have missed your task.",
        color: '#4F4F4F',
        buttonText: 'Back to Tasks'
    },
    { // completed
        backgroundColor: '#DEEDD2',
        body: "Your Task has been completed. Great Job!",
        color: '#55A61C',
        buttonText: 'Back to Tasks'
    },
]

let navigation;
class TaskStatus extends Component {
    constructor(props) {
        super(props);
        navigation = this.props.navigation;

        this.state = {
            task: this.props.route.params["task"],
            modal: false,
            helpModal: false
        };

        this.completed = this.state.task.task.completed;
        this.status = this.state.task.task.status;
        this.title = this.state.task.task.name;

        this.changeTask = this.changeTask.bind(this);
    }

    changeTask() {
        if (this.completed || this.status === 3) { // completed or missed
            navigation.reset({ index: 0, routes: [{ name: "MyTasks" }] });
        } else if (this.status === 1) { // in progress
            this.context.state.user.updatePoints(this.context.state.user.points + this.state.task.task.point_value);
            this.state.task.task.setComplete(true);
            this.setState({ modal: true });
        } else { // upcoming or overdue
            this.state.task.task.setStatus(1);
            this.setState({ status: 1 })
            navigation.reset({ index: 0, routes: [{ name: "MyTasks" }] });
        }
        this.props.route.params['callback']()
    }
    
    getSteps() {
        if ( this.state.task.task.steps) {
            const steps = JSON.parse(this.state.task.task.steps);
            const list = steps.map((step, index) => {
                return <Text key={index} style={styles.helpText}>{index + 1}: {step.description}{'\n'}</Text>
            });
            return list;
        }
    }

  render() {
    return (
    <SafeAreaView style={[styles.container, {backgroundColor: (this.completed ? types[4].backgroundColor : types[this.status].backgroundColor)}]}>
        <View style={styles.icons}>
            <Icon name="arrow-back" size={30} onPress={() => {navigation.goBack()}}/>
            <Icon name="assignment" size={30} onPress={() => {
                    navigation.navigate("TaskDetail", {
                        task: this.state.task.task
                    });
                }}/>
        </View>
        <Text style={[styles.title, {color: this.completed ? types[4].color: types[this.status].color } ]}>
            {this.title}
        </Text>
        <Icon name="alarm" size={54} 
            style={[styles.clock, {backgroundColor: this.completed ? types[4].color: types[this.status].color}]}/>
        <Text 
            style={[styles.body, {color: this.completed ? types[4].color: types[this.status].color }]}>
            { this.completed ? types[4].body : types[this.status].body}
        </Text>
        {(this.status === 1 && this.completed === false) ? 
            <View style={styles.cardView} >
                <TouchableOpacity
                    style={styles.helpComplete}
                    onPress={() => {this.setState({helpModal: true})}}
                >
                    <Icon style={styles.helpIcon} name='help-outline'></Icon>
                    <Text style={styles.helpText}>Help me complete this task</Text>
                </TouchableOpacity>
            </View> : 
            null}
        <View style={styles.button}>
            <PrimaryButton
                text={this.completed ? types[4].buttonText: types[this.status].buttonText}
                color={this.completed ? types[4].color: types[this.status].color}
                onPress={this.changeTask.bind()}
            />
        </View>
        <Modal 
          isVisible={this.state.modal}
          backdropColor='gray'
          backdropOpacity={0.4}
          animationIn='fadeIn'
          animationOut='fadeOut'
        >
          <View style={styles.modal}>
            <Icon name="sentiment-satisfied" size={70} color="#55A61C"/>
            <Text style={styles.contentTitle}>Task Complete!</Text>
            <Text style={styles.modalBody}>You've earned {this.state.task.task.point_value} points!</Text>
            <View style={{flexDirection:'row'}}>
             <PrimaryButton text="Great!" color="#55A61C" 
                onPress={() => {
                    this.setState({modal: false});
                    navigation.navigate("MyTasks");
                    }} />
            </View>
          </View>
        </Modal>
        <Modal 
          isVisible={this.state.helpModal}
          backdropColor='gray'
          backdropOpacity={0.4}
          animationIn='fadeIn'
          animationOut='fadeOut'
        >
          <View style={styles.modal}>
            <Text style={styles.contentTitle}>{this.title}</Text>
            <View>
                <Text>{this.getSteps()}</Text>
                <PrimaryButton text="Close" color="#1D76AA" 
                    onPress={() => {
                        this.setState({helpModal: false});
                        }} />
            </View>
          </View>
        </Modal>
    </SafeAreaView>
    );
  }
}
TaskStatus.contextType = AppContext;
export default TaskStatus;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        padding: 12,
        marginTop: 32,
        marginBottom: 24,
        fontWeight: 'bold'
    },
    body: {
        fontSize: 18,
        marginTop: 24,
        paddingHorizontal: 24,
        textAlign: 'center'
    },
    clock: {
        padding: 18,
        color: 'white',
        overflow: 'hidden',
        borderRadius: 45,
        margin: 12
    },
    button: {
        position: 'absolute',
        bottom: 32
    },
    icons: {
        height: 50,
        flexDirection: 'row',
        marginTop: 12,
        width: '100%',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 24
    },
    modal: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        paddingVertical: 12
    },
    modalBody: {
        fontSize: 18,
        color: '#333333',
        paddingBottom: 6
      },
      cardView: {
          width: '100%',
          height: '20%',
          justifyContent: 'center',
          alignItems: 'center',
      },
      helpComplete: {
          height: '60%',
          width: '80%',
          backgroundColor: '#FFFFFF',
          borderRadius: 6,
          flexDirection: 'row',
          padding: 6,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.5,
          borderRadius: 10,
      },
      helpText: {
        fontSize: 18,
        padding: 6,
        paddingVertical: 12,
      },
      helpIcon: {
        fontSize: 50
      }
});

TaskStatus.propTypes = {
    title: PropTypes.string,
    time: PropTypes.string,
    status: PropTypes.number,
    completed: PropTypes.bool,
}

TaskStatus.defaultProps = {
    title: 'Task Name',
    time: '4:00',
    status: 2,
    completed: false,
}