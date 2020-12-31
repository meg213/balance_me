import AsyncStorage from "@react-native-community/async-storage";

export class userStorage {
  static loaded = false;
  static storeUser = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
      userStorage.userExists = true;
    } catch (e) {
      console.error(e);
    }
  };

  static getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error(e);
    }
  };

  static removeUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
      userStorage.userExists = false;
    } catch (e) {
      console.error(e);
    }
  };
}
