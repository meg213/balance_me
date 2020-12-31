import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Swipe from './swipe';

/*
Props: 
    status: 1='overdue', 2=upcoming, 3='missed' 
    imageUri: require('string-to-asset-image')
    name: the name of the task
    time: time of the task (currently a string, will need to change)
    point_value: number, point value
    completed: bool
*/
export default class Task extends Component {

  render() {
    // only render swipeable if overdue, upcoming, or in-progress
    if (this.props.status === 3 || this.props.completed) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={this.props.onPress}
            style={[styles.button, taskType(this.props.status, this.props.completed)]}
          >
          { this.props.imageUri ? 
              <Image source={this.props.imageUri} style={[styles.image]}/>
              :<Image source={require('./../assets/icons8-task-90.png')} style={[styles.image]}/>
          }
          <View style={styles.textContainer}>
              <Text numberOfLines={1} style={styles.name}>{this.props.name} </Text>
              <Text style={styles.point_value}>{this.props.point_value} pts</Text>
          </View>
          <Text style={styles.time}>{this.props.time}</Text>
          </TouchableOpacity>
        </View>
      );
    } 
    else {
      return (
        <Swipe onPress={ this.props.quickComplete.bind() }>
          <View style={styles.container}>
              <TouchableOpacity
                onPress={this.props.onPress}
                style={[styles.button, taskType(this.props.status, this.props.completed)]}
              >
              { this.props.imageUri ? 
                  <Image source={this.props.imageUri} style={[styles.image]}/>
                  :<Image source={require('./../assets/icons8-task-90.png')} style={[styles.image]}/>
              }
              <View style={styles.textContainer}>
                  <Text numberOfLines={1} style={styles.name}>{this.props.name} </Text>
                  <Text style={styles.point_value}>{this.props.point_value} pts</Text>
              </View>
              <Text style={styles.time}>{this.props.time}</Text>
              </TouchableOpacity>
          </View>
        </Swipe>
      );
    }
  }
}

/* defines the colors of the task cards depending on their type: 'overdue', 'upcoming', or 'completed'
    @params type: 0-3. 0=overdue, 1=IP, 2=upcoming, 3=missed
            completed: bool, has the task been completed
 */
const taskType = function(status, completed) {
    if (completed) { //is it completed
      return {
        backgroundColor: '#DEEDD2',
        borderLeftColor: '#55A61C',
      }
    } else { 
        if (status === 0) { //overdue
          return {
            backgroundColor: '#ffb3a7', // original: backgroundColor: '#FEEDEA',
            borderLeftColor: '#F24822',
          }
        } else if (status == 1) { // in progress
            return {
              backgroundColor: '#ECF9FF',
              borderLeftColor: '#1D76AA',
            }
        } else if (status == 2) { //upcoming
          return {
            backgroundColor: '#FCF5DE',
            borderLeftColor: '#F2CD5C',
          }
        }else { //missed, status = 3
          return {
            backgroundColor: '#F2F2F2',
            borderLeftColor: '#4F4F4F',
          }
        }
    }   
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    height: 70,
    flexDirection: 'row',
    borderLeftWidth: 4,
  },
  image: {
    marginBottom: 6,
    left: 0,
    height: 45,
    width: 45
  },
  textContainer: {
    width: 196,
    marginRight: 16,
    paddingHorizontal: 6,
    borderRightWidth: 1
  },
  name: { 
    color: '#000000',
    fontSize: 18,
    paddingBottom: 3,
    fontWeight: "500",
    flexWrap: 'wrap',
  },
  point_value: {
    fontSize: 14,
    color: '#000000',
  },
  time: {
    fontSize: 24,
    right: 0,
    borderLeftColor: 'black',
    paddingVertical: 6
  }
});

//puts restrictions on what type each prop can be
Task.propTypes = {
  id: PropTypes.string,
  imgUri: PropTypes.object,
  name: PropTypes.string,
  status: PropTypes.number,
  time: PropTypes.any,
  point_value: PropTypes.number,
  completed: PropTypes.bool,

  onPress: PropTypes.func,
  quickComplete: PropTypes.any
};

// what will the default be if none is specified
Task.defaultProps = {
  id: 1,
  imageUri: null,
  name: 'Define Task Here',
  status: 1, //in progress
  time: '18 Jun 2020 21:40:00 GMT-0400', //will prob need to change this to make it an actual time
  point_value: 10,
  completed: false,

  onPress: () => {},
  quickComplete: () => {}
}