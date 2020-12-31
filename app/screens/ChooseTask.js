import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Card from "./../components/card.js";
import Stepper from "./../components/stepper.js";
import "react-native-gesture-handler";
import PrimaryButton from "./../components/button.js";
import { Icon } from "react-native-elements";
let navigation;
class ChooseTask extends Component {
  constructor(props) {
    super(props)
    navigation = this.props.navigation;
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
  }
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>Let's create a task:</Text>
        <Stepper step={2} />
        <View style={styles.selection}>
          <Text style={styles.selectText}>
            Select from the following, or create a custom task:
          </Text>
          <PrimaryButton
            text="Create A Custom Task"
            color="black"
            onPress={() => {
              this.props.navigation.navigate("CustomTask");
            }}
          />
          <View style={styles.cards}>
            <Card
              text="Health"
              height={140}
              width={140}
              color="#7FD7FF"
              imageUri={require("./../assets/icons8-healthy-eating-100.png")}
              imgHeight={70}
              imgWidth={70}
              onPress={
                () => {
                  navigation.navigate("DefaultTaskList", {
                    category: 0
                  });
                }
              }
            />
            <Card
              text="Home"
              height={140}
              width={140}
              color="#A1D991"
              imageUri={require("./../assets/icons8-running-100.png")}
              imgHeight={70}
              imgWidth={70}
              onPress={
                () => {
                  navigation.navigate("DefaultTaskList", {
                    category: 1
                  });
                }
              }
            />
            <Card
              text="School"
              height={140}
              width={140}
              color="#F24822"
              imageUri={require("./../assets/icons8-yard-work-100.png")}
              imgHeight={70}
              imgWidth={70}
              onPress={
                () => {
                  navigation.navigate("DefaultTaskList", {
                    category: 2
                  });
                }
              }
            />
            <Card
              text="Other"
              height={140}
              width={140}
              color="#F2CD5C"
              imageUri={require("./../assets/icons8-add-new-100.png")}
              imgHeight={70}
              imgWidth={70}
              onPress={() => {
                this.props.navigation.navigate("DefaultTaskList", {
                  category: 3
                });
              }}
            />
          </View>
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
  selection: {
    backgroundColor: "#FBF5E4",
    alignItems: "center",
    width: "100%",
    height: 400,
    marginVertical: 40,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  mainText: {
    fontSize: 32,
    paddingBottom: 50,
    paddingTop: 50,
    color: "#F2CD5C",
    fontWeight: "bold",
  },
  selectText: {
    fontSize: 18,
    padding: 12,
  },
});
export default ChooseTask;
