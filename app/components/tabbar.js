import React, { Component } from "react";
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, SafeAreaView} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'

const tabs = [
    { icon: <Icon name="event" size={26}/> },
    { icon: <Icon name="videogame-asset" size={26}/> },
    { icon: <Icon name="add" size={36} /> },
    { icon: <Icon name="equalizer" size={26}/> },
    { icon: <Icon name="person" size={26}/> },
  ];

let navigation;
export default class TabBar extends Component {
  constructor(props) {
    super(props);
    navigation = this.props.navigation;

    this.state = {
      index: null
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab} onPress={
            () => { this.props.taskPress()}
            }>
            <Icon name="event" size={26}/> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={
            () => { this.props.addPress() }
            }>
            <Icon name="add" size={36}/> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={
            () => {  this.props.profilePress() }
            }>
            <Icon name="person" size={26}/> 
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: 'row',
    height: 54,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "white",
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    width: 40,
    height: 40,
    marginHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

//puts restrictions on what type each prop can be
TabBar.propTypes = {
  taskPress: PropTypes.func,
  addPress: PropTypes.func,
  profilePress: PropTypes.func,
};

// what will the default be if none is specified
TabBar.defaultProps = {
  taskPress: () => {},
  addPress: () => {},
  profilePress: () => {}
}