import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from "react-native";

export default class PrimaryButton extends Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress();
  };

  render() {
    return (
      <View>
          <View style={styles.container}>
            <View style={[styles.step, {backgroundColor: "#A1D991" }]}/>
            <View style={[styles.step, (this.props.step > 1) ? {backgroundColor:"#A1D991"}: {backgroundColor:'#BDBDBD'} ]}/>
            <View style={[styles.step, (this.props.step > 2) ? {backgroundColor:"#A1D991"}: {backgroundColor:'#BDBDBD'} ]}/>
            <View style={[styles.step, (this.props.step > 3) ? {backgroundColor:"#A1D991"}: {backgroundColor:'#BDBDBD'} ]}/>
          </View>
          <Text style={styles.text}>{this.props.step}/4</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: 'row'
  },
  step: {
    height: 5,
    width: 40,
    margin: 6,
  },
  text: { 
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: "right",
    paddingRight: 6
  }
});

//puts restrictions on what type each prop can be
PrimaryButton.propTypes = {
  step: PropTypes.number
};

// what will the default be if none is specified
PrimaryButton.defaultProps = {
  step: 1
}