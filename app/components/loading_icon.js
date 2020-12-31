import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from "react-native";


export default class LoadingIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: this.props.loading
    }
  }

  render() {
    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.loading}>
            <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
                size={Platform.OS == "ios" ? "large" : 50}
                color="#37C1FF"
            />
            </View>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
      },
      activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }
});

// what will the default be if none is specified
LoadingIcon.defaultProps = {
  loading: false
}