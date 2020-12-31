import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default class PrimaryButton extends Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPress}
          style={[styles.button, {backgroundColor:this.props.color}]}
        >
        <Text style={styles.text}>{this.props.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  button: {
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: 300,
  },
  text: { 
    color: '#FFFFFF',
    fontSize: 16
  }
});

//puts restrictions on what type each prop can be
PrimaryButton.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
};

// what will the default be if none is specified
PrimaryButton.defaultProps = {
  text: 'hello',
  color: '#F2CD5C',
  onPress: () => {}
}