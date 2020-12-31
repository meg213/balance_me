import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "./../components/button.js";
import Card from './../components/card.js';

import { Context as AppContext } from "../context/appContext";

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let { state } = this.context;
    this.setState({ user: state.user });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.text}>
          <Text style={styles.bigText}>My Profile</Text>
        </View>
        <View style={styles.cards}>
          <Card 
            onPress={() => {this.props.navigation.navigate("ProfileScreen");}}
            insideAlign="flex-start"
            text={this.state.user.first_name + " " + this.state.user.last_name}
            textSize={28}
            subtext={"Points: " + this.state.user.points}
            subtextSize={22}
            subtextColor="#F2CD5C"
            height={110}
            width={370}
            color="#FFFFFF"
            borderRad={15}
            bColor="#000000"
            bWidth={1}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cards: {
    flexDirection: 'row',
    flexWrap: "wrap",
    justifyContent: 'center',
    paddingTop: 30,
  },
  text: {
    marginTop: -450,
    marginLeft: -120,
  },
  bigText: {
    fontSize: 42,
    fontWeight: "700",
  },
});

export default SettingsPage;
