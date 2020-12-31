import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Icon } from 'react-native-elements';
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
export default class Default_Task extends Component {

  render() {
    // only render swipeable if overdue, upcoming, or in-progress
    return (
    <View style={styles.container}>
        <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}
        >
        { this.props.imageUri ? 
            <Image source={this.props.imageUri} style={[styles.image]}/>
            :<Image source={require('./../assets/icons8-task-90.png')} style={[styles.image]}/>
        }
        <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.name}>{ ((this.props.name).length > 16) ? 
            (((this.props.name).substring(0,16-3)) + '...') : 
            this.props.name }</Text>
            <View style={styles.ValueCountContainer}>
                <Icon
                  name="stars"
                  size={40}
                  // style={{ marginRight:  }}
                  color="gold"
                  underlayColor="black"
                  iconStyle={styles.GoldIconStyle}
                />
                <Text style={styles.PointValue}>{this.props.point_value}</Text>
            </View>
        </View>
        </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    marginBottom: 6
  },
  button: {
    padding: 12,
    borderRadius: 5,
    height: 70,
    flexDirection: 'row',
    borderLeftWidth: 4
  },
  image: {
    marginBottom: 6,
    left: 0,
    height: 45,
    width: 45
  },
  textContainer: {
    width: '100%',
    marginRight: 16,
    paddingHorizontal: 6,
  },
  name: { 
    color: '#000000',
    fontSize: 18,
    fontWeight: "500",
    flexWrap: 'wrap',
    position: 'relative',
    top: 11
  },
  point_value: {
    fontSize: 14,
    color: '#000000',
  },
  SubHeading: {
    fontSize: 20,
    fontWeight: "500",
    padding: 5,
    textDecorationLine: "underline",
    textTransform: "uppercase",
  },
  PointValue: {
    fontWeight: "500",
    fontSize: 25,
    textAlign: "center",
    textDecorationStyle: "solid",
    textDecorationColor: "black",
    color: "#b89d0b",
  },
  ValueCountContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F2CD5C",
    width: 110,
    alignSelf: 'flex-end',
    bottom: 20,
    right: 44
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
});

//puts restrictions on what type each prop can be
Default_Task.propTypes = {
  imgUri: PropTypes.object,
  name: PropTypes.string,
  point_value: PropTypes.number,

  onPress: PropTypes.func,
};

// what will the default be if none is specified
Default_Task.defaultProps = {
  imageUri: null,
  name: 'Define Task Here',
  point_value: 10,

  onPress: () => {},
}