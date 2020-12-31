import React, { Component } from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import { Text, Button, Input, Icon } from "react-native-elements";
import { Context as AppContext } from "../context/appContext";
import "react-native-gesture-handler";
import userService from '../backend/services/userService';

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//TODO: Should be able to go "back" to this page after page is submitted
class CreateAccount extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    error_firstName: "",
    error_lastName: "",
    error_email: "",
    error_password: "",
    loading_icon: false
  };

  handleFirstName = (text) => {
    this.setState({ firstName: text });
  };

  handleLastName = (text) => {
    this.setState({ lastName: text });
  };

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  handleSignUp = async () => {
    var valid = true;
    if (!this.state.firstName) {
      this.setState({ error_firstName: "Please provide your first name." })
      valid = false;
    } else {
      this.setState({ error_firstName: "" })
    }
    if (!this.state.lastName) {
      this.setState({ error_lastName: "Please provide your last name." })
      valid = false;
    } else {
      this.setState({ error_lastName: "" })
    }
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
      var new_user = await userService.createUser(this.state.firstName, this.state.lastName, 0, this.state.password, this.state.email);
      if (new_user.status == 422) {
        this.setState({ error_email: "That email already exists. You can try logging in with that email or using a different email." })
        this.setState({ loading_icon: false })
        return;
      } else {
        this.setState({ error_email: "" })
        await this.context.loginUser(this.state.email, this.state.password);
        this.setState({ loading_icon: false })
        this.props.navigation.reset({ index: 0, routes: [{ name: "MyTasks" }] });
      }
    }
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
    </Modal>;
    return (
      <View style={styles.background}>
        {(this.state.loading_icon) ? loading_icon : null}
        <View style={styles.container}>
          <Text style={styles.headerText}>Create Account</Text>
          <View style={styles.formBlock}>
            <Input
              placeholder="First Name"
              maxLength={30}
              onChangeText={this.handleFirstName}
              inputStyle={styles.inputLabel}
              inputContainerStyle={styles.inputContainer}
              errorMessage={this.state.error_firstName}
            />
            <Input
              placeholder="Last Name"
              maxLength={30}
              onChangeText={this.handleLastName}
              inputStyle={styles.inputLabel}
              inputContainerStyle={styles.inputContainer}
              errorMessage={this.state.error_lastName}
            />
            <Input
              placeholder="Email"
              maxLength={30}
              onChangeText={this.handleEmail}
              inputStyle={styles.inputLabel}
              inputContainerStyle={styles.inputContainer}
              errorMessage={this.state.error_email}
            />
            <Input
              placeholder="Password"
              maxLength={30}
              onChangeText={this.handlePassword}
              inputStyle={styles.inputLabel}
              inputContainerStyle={styles.inputContainer}
              errorMessage={this.state.error_password}
              secureTextEntry={true}
            />
          </View>
          <Button
            title="Sign Up"
            onPress={this.handleSignUp}
            buttonStyle={styles.signUpButton}
          />
        </View>
      </View>
    );
  }
}

CreateAccount.contextType = AppContext;

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
    marginTop: 75,
    fontSize: 48,
    fontWeight: "400",
  },
  formBlock: {
    marginTop: 40,
    marginBottom: 40,
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
    paddingTop: 10,
    fontWeight: "300",
  },
  signUpButton: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#1D76AA",
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

export default CreateAccount;
