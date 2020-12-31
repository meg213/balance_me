import * as React from "react";
import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import FirstTimeUser from "./app/screens/FirstTimeUser";
import CreateAccount from "./app/screens/CreateAccount";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import CreateTask from "./app/screens/CreateTask";
import ChooseTask from "./app/screens/ChooseTask";
import TaskDetail from "./app/screens/TaskDetail";
import MyTasks from "./app/screens/MyTasks";
import TaskStatus from "./app/screens/TaskStatus";
import CustomTask from "./app/screens/CustomTask";
import TaskPrompt from "./app/screens/TaskPrompt";
import ProfileScreen from "./app/screens/ProfileScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen";
import InitialLoading from "./app/screens/InitialLoading";
import DefaultTaskList from "./app/screens/DefaultTaskList";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider as AppProvider } from "./app/context/appContext";
import { userStorage } from "./app/backend/local_storage/userStorage";
import { taskStorage } from "./app/backend/local_storage/taskStorage";

const Stack = createStackNavigator();
console.disableYellowBox = true;

//TODO: Display screen only if name prop not set (should probably be done from App.js using AsyncStorage)
export default function App() {
  // Uncomment this to removed the user from the application for testing or development purposes.
  userStorage.removeUser();
  taskStorage.removeCategories();
  const headerOption = { headerShown: false };
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="InitialLoading"
            component={InitialLoading}
            options={headerOption}
          />
          <Stack.Screen
            name="FirstTimeUser"
            component={FirstTimeUser}
            options={headerOption}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccount}
            options={headerOption}
          />
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={headerOption}
          />
          <Stack.Screen
            name="CreateTask"
            component={CreateTask}
          />
          <Stack.Screen
            name="ChooseTask"
            component={ChooseTask}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetail}
            options={{ headerTitle: false, headerBackTitleVisible: false }}
            initialParams={{
              taskTitle: "Create a title",
              taskTimer: "0:00\nMins",
              taskTimestamp: "October 13, 2020 11:13:00",
              taskDescription:
                "Lorem ipsum dolor sit amet, te brute pertinacia signiferumque mea, civibus fastidii quaerendum eos ei, libris volumus pro no. Id volumus iudicabit has. Euismod insolens ex eum, erant sententiae sed ne, est et malis consul. Cum delectus omittantur ne. Novum nostrum rationibus nam et, qui tincidunt honestatis ut, ut magna feugiat vel. Pri velit percipit no.",
              taskPoints: 5,
            }}
          />
          <Stack.Screen
            name="MyTasks"
            component={MyTasks}
            options={headerOption}
          />
          <Stack.Screen name="CustomTask" component={CustomTask} />
          <Stack.Screen
            name="TaskStatus"
            component={TaskStatus}
            options={headerOption}
          />
          <Stack.Screen
            name="TaskPrompt"
            component={TaskPrompt}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={headerOption}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={headerOption}
          />
          <Stack.Screen
            name="DefaultTaskList"
            component={DefaultTaskList}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
