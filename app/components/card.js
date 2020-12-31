import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";


export default class Card extends Component {
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
          style={[styles.button, {alignItems: this.props.insideAlign}, {borderRadius: this.props.borderRad}, {borderColor: this.props.bColor}, {borderWidth: this.props.bWidth}, {backgroundColor: this.props.color}, {height: this.props.height}, {width: this.props.width}]}
        >
        { this.props.imageUri ? 
            <Image source={this.props.imageUri} style={[styles.image, {height:this.props.imgHeight},{width: this.props.imgWidth}]}/>
             : null
        }
        <Text style={[styles.text, {fontSize: this.props.textSize}, {color: this.props.textColor}]}>{this.props.text}</Text>
        <Text style={[styles.subtext, {fontSize: this.props.subtextSize}, {color: this.props.subtextColor}]}>{this.props.subtext}</Text>
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
    padding: 15,
  },
  text: { 
    paddingBottom: 6,
    textAlign: "center",
    fontWeight: "500"
  },
  subtext: {
    textAlign: "center"
  },
  image: {
      marginBottom: 6
  }
});

//puts restrictions on what type each prop can be
Card.propTypes = {
  insideAlign: PropTypes.string,
  text: PropTypes.string,
  subtext: PropTypes.string,
  textSize: PropTypes.number,
  subtextSize: PropTypes.number,
  borderRad: PropTypes.number,
  bColor: PropTypes.string,
  bWidth: PropTypes.number,
  color: PropTypes.string,
  textColor: PropTypes.string,
  subtextColor: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  imgSrc: PropTypes.object,
  imgHeight: PropTypes.number,
  imgWidth: PropTypes.number,
  onPress: PropTypes.func,
};

// what will the default be if none is specified
Card.defaultProps = {
  insideAlign: 'center',
  text: 'hello',
  subtext: '',
  textSize: 24,
  subtextSize: 14,
  borderRad: 5,
  bColor: '#FFFFFF',
  bWidth: 0,
  color: '#55A61C',
  textColor: '#000000',
  subtextColor: '#000000',
  height: 160,
  width: 150,
  imageUri: null,
  imgWidth: 40,
  imgHeight: 40,
  onPress: () => {},
}