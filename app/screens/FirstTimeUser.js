import React, { Component } from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import { Text, Button, Input, Icon } from "react-native-elements";
import { Context as AppContext } from "../context/appContext";
import { userStorage } from "../backend/local_storage/userStorage";
import { taskStorage } from "../backend/local_storage/taskStorage";
import "react-native-gesture-handler";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//TODO: Shouldn"t be able to go "back" to this page after page is submitted
class FirstTimeUser extends Component {
  state = {
    email: "",
    password: "",
    error_email: "",
    error_password: "",
    loading_icon: false
  };

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  handleLogIn = async () => {
    var valid = true;
    if (!this.state.email) {
      this.setState({ error_email: "Please provide your email." })
      valid = false;
    } else {
      if (!emailRegex.test(this.state.email)) {
        this.setState({ error_email: "Please provide an email in a valid format." })
        valid = false;
      } else {
        this.setState({ error_email: "" })
      }
    }
    if (!this.state.password) {
      this.setState({ error_password: "Please provide a password." })
      valid = false;
    } else {
      this.setState({ error_password: "" })
    }
    if (!valid) {
      return;
    } else {
      this.setState({ loading_icon: true })
      await this.context.loginUser(this.state.email, this.state.password);
      await taskStorage.storeDefaultTask();
      if (this.context.state.login_err_msg.message) {
        if (this.context.state.login_err_msg.status == 404) {
          this.setState({ error_email: this.context.state.login_err_msg.message, error_password: "", loading_icon: false })
        } else if (this.context.state.login_err_msg.status == 401) {
          this.setState({ error_password: this.context.state.login_err_msg.message, error_email: "", loading_icon: false })
        }
      } else {
        this.setState({ error_email: "", error_password: "" })
        this.setState({ loading_icon: false })
        this.props.navigation.reset({ index: 0, routes: [{ name: "MyTasks" }] });
      }
    }
    // const value = this.state.namevalue;
    // console.log("value: ", value);
    // if (typeof value != "undefined" && value != "" && value != null) {
    //   global.username = value;
    //   // KORY TODO: when we get local storage, add way of pulling local data instead of remote
    //   await this.context.state.user.updateFirstName(value);
    //   this.props.navigation.navigate("WelcomeScreen");
    // }
  };

  handleSignUp = async () => {
    this.props.navigation.navigate("CreateAccount");
  };

  render() {
    var loading_icon = <Modal
      transparent={true}
      animationType={'none'}
      visible={true}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size={Platform.OS == "ios" ? "large" : 50}
            color="#37C1FF"
          />
        </View>
      </View>
    </Modal>
    return (
      <View style={styles.background}>
        {(this.state.loading_icon) ? loading_icon : null}
        <View style={styles.container}>
          <Text style={styles.headerText}>Balance Me</Text>
          <View style={styles.formBlock}>
            <Input
              label="Sign In"
              placeholder="Email"
              maxLength={30}
              onChangeText={this.handleEmail}
              labelStyle={styles.formLabel}
              inputStyle={styles.inputLabel}
              inputContainerStyle={styles.inputContainer}
              leftIcon={
                <Icon name="mail-outline" type="material" size={24} iconStyle={styles.inputIcon} />
              }
              errorMessage={this.state.error_email}
            />
            <Input
              placeholder="Password"
              maxLength={30}
              onChangeText={this.handlePassword}
              type="password"
              inputStyle={styles.inputLabel}
              inputContainerStyle={styles.inputContainer}
              secureTextEntry={true}
              leftIcon={
                <Icon name="lock" type="material" size={24} iconStyle={styles.inputIcon} />
              }
              errorMessage={this.state.error_password}
            />
          </View>
          <Button
            title="Log In"
            onPress={this.handleLogIn}
            buttonStyle={styles.logInButton}
          />
          <Button
            title="Create Account"
            onPress={this.handleSignUp}
            buttonStyle={styles.signUpButton}
          />
        </View>
      </View>
    );
  }
}

FirstTimeUser.contextType = AppContext;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FCFCFC",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 30,
    marginRight: 30,
  },
  headerText: {
    marginTop: 100,
    fontSize: 48,
    fontWeight: "600",
  },
  formBlock: {
    marginTop: 50,
    marginBottom: 25,
  },
  formLabel: {
    color: "black",
    fontSize: 24,
    marginLeft: -5,
    fontWeight: "500",
  },
  inputContainer: {
    marginLeft: -5,
    marginRight: -5,
    borderBottomWidth: 0.5,
    borderColor: "black",
  },
  inputLabel: {
    color: "black",
    fontSize: 20,
    paddingTop: 15,
    paddingLeft: 5,
    fontWeight: "300",
  },
  inputIcon: {
    paddingTop: 15,
  },
  logInButton: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  signUpButton: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#F2CD5C",
  },
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

export default FirstTimeUser;
