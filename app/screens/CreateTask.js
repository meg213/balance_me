import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Card from './../components/card.js';
import Stepper from './../components/stepper.js'
import 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';


//TODO: send "individual" as group preference to chooseTask
class CreateTask extends Component {
    constructor(props) {
        super(props)
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
    state = {}
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>Let's create a task:</Text>
                <Stepper step={1} />
                <View style={styles.selection}>
                    <Text style={styles.selectText}>Select the type of task you would like to complete:</Text>
                    <View style={styles.cards}>
                        <Card
                            onPress={() => {
                                this.props.navigation.navigate("ChooseTask");
                            }}
                            text="Individual"
                            subtext="I'd like to complete a task by myself"
                            imageUri={require('./../assets/icons8-head-with-brain-100.png')}
                        />
                        <Card
                            text="Group"
                            subtext="I'd like to complete a task with others"
                            color="#A1D991"
                            imageUri={require('./../assets/icons8-user-groups-100.png')}
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
        backgroundColor: '#FBF5E4',
        alignItems: 'center',
        width: '100%',
        height: 400,
        marginTop: 40,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    cards: {
        flexDirection: 'row',
        marginTop: 24
    },
    mainText: {
        fontSize: 32,
        paddingBottom: 50,
        paddingTop: 50,
        color: "#F2CD5C",
        fontWeight: 'bold'
    },
    selectText: {
        fontSize: 18,
        padding: 12
    }

});
export default CreateTask;
