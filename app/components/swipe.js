import React, { Component, useState } from "react";
import { Animated, StyleSheet, Text, View, Button } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

/*
 * This class is the swipable tasks. If you click the swipable, a modal pops up.
 */
export default class Swipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <RectButton style={styles.rightAction} onPress={this.close}>
        <AnimatedIcon
          name="done"
          size={30}
          color="#fff"
          style={[
            styles.actionIcon,
            Platform.OS == "ios" ? { transform: [{ scale }] } : {},
          ]}
        />
      </RectButton>
    );
  };
  updateRef = (ref) => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
    this.setState({ modal: true });
  };
  complete() {
    this.setState({ modal: false });
    this.props.onPress();
  }
  render() {
    const { children } = this.props;
    return (
      <View>
        <Swipeable
          ref={this.updateRef}
          friction={2}
          rightThreshold={20}
          renderRightActions={this.renderRightActions}
        >
          {children}
        </Swipeable>
        <View>
          <Modal
            isVisible={this.state.modal}
            backdropColor="gray"
            backdropOpacity={0.4}
            animationIn="fadeIn"
            animationOut="fadeOut"
          >
            <View style={styles.modal}>
              <Text style={styles.contentTitle}>Complete Task?</Text>
              <View style={{ flexDirection: "row" }}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    this.setState({ modal: false });
                  }}
                />
                <Button title="Complete" onPress={() => this.complete()} />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionIcon: {
    width: 30,
    marginHorizontal: 20,
  },
  rightAction: {
    alignItems: "flex-end",
    backgroundColor: "#55A61C",
    borderRadius: 5,
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

Swipe.propTypes = {
  onPress: PropTypes.func,
};
Swipe.defaultProps = {
  onPress: () => {},
};
