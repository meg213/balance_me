import AsyncStorage from "@react-native-community/async-storage";

export class taskStorage {
  static defaultHealth = {
    list: [
      {
        name: "Take medication",
        description:
          "Take your daily medication. Write the names of your medications here.",
        steps: [
          { description: "Pour a glass of water" },
          {
            description: "Take out the correct number of pills for your dosage",
          },
          {
            description:
              "Follow the instructions on the bottle to take the pills",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 0,
      },
      {
        name: "Go on a run",
        description:
          "Get your body moving! Do some exercise by going on a run.",
        steps: [
          { description: "Put on appropriate running clothes" },
          { description: "Lace up your sneaker" },
          { description: "Don't forget a house key" },
          {
            description:
              "Bring a bottle of water if you're going on a long run",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 0,
      },
      {
        name: "Drink water",
        description: "Drink 8 glasses of water in a day to stay hydrated.",
        steps: [
          { description: "Drink water with every meal" },
          { description: "Drink a glass of water whenever you're thirsty" },
          {
            description:
              "Make sure to drink more water if you've been sweating",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 0,
      },
      {
        name: "Check blood pressure",
        description:
          "Check your blood pressure periodically to stay on top of your health.",
        steps: [
          { description: "Put the cuff on your arm, not over clothes" },
          {
            description: "Press the button on the machine to inflate the cuff",
          },
          {
            description: "Make a note of the blood pressure reading",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 0,
      },
    ],
  };
  static defaultHome = {
    list: [
      {
        name: "Make the bed",
        description: "Start each day by making your bed!",
        steps: [
          { description: "Straighten out the covers" },
          { description: "Tuck bottom of covers into the mattress" },
          {
            description: "Arrange the pillows",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 1,
      },
      {
        name: "Take out the trash",
        description: "Take out the trash if it is full.",
        steps: [
          { description: "Check trash bin to see if it is full" },
          { description: "Tie the garbage bag closed" },
          { description: "Bring the garbage bag outside" },
          {
            description: "Put a new garbage bag in the bin",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 1,
      },
      {
        name: "Wash the dishes",
        description:
          "Wash the dishes after every meal so that they don't pile up.",
        steps: [
          { description: "Put dirty dishes on one side of the sink" },
          { description: "Rinse a dirty plate with water" },
          {
            description:
              "Put some dish soap on a sponge and scrub the plate until it is clean",
          },
          {
            description:
              "Dry the plate with a towel and put it on the other side of the sink",
          },
          { description: "Repeat until all dishes are clean" },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 1,
      },
      {
        name: "Walk the dog",
        description: "Take care of your dog by taking it on a walk.",
        steps: [
          { description: "Get dressed to go on a walk" },
          { description: "Grab a leash for your dog and some plastic bags" },
          {
            description: "Use the plastic bags to clean up after the dog",
          },
          { description: "Make sure the dog has water if it is hot outside" },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 1,
      },
    ],
  };
  static defaultSchool = {
    list: [
      {
        name: "Pack notebooks",
        description:
          "Make sure you have everything you need for the school day.",
        steps: [
          { description: "Pack any textbooks you will need" },
          {
            description:
              "Pack your notebooks so you can write down notes in class",
          },
          {
            description:
              "Make sure to pack any homework that is due and needs to be handed in",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 2,
      },
      {
        name: "Prepare lunch",
        description: "Pack a lunch for today.",
        steps: [
          { description: "Get your lunchbox or a paper bag" },
          {
            description:
              "Pack a balanced meal (a sandwich is a great choice, but you can be creative)",
          },
          { description: "Pack a drink (water is a healthy option)" },
          {
            description:
              "Make sure to add an icepack if the food needs to be kept cool",
          },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 2,
      },
      {
        name: "Choose outfit",
        description: "Pick out something to wear today!",
        steps: [
          { description: "Check the weather forecast" },
          {
            description:
              "If it will be cold, wear heavier clothes (sweater, long pants, underwear, socks, shoes)",
          },
          {
            description:
              "If it will be warm, wear lighter clothes (T-shirt, shorts, underwear, maybe sandals?)",
          },
          {
            description:
              "Dry the plate with a towel and put it on the other side of the sink",
          },
          { description: "Get dressed!" },
        ],
        point_value: 15,
        estimated_time: 900,
        category_id: 2,
      },
    ],
  };
  static defaultOther = {
    list: [],
  };

  static health = {
    list: [],
  };
  static home = {
    list: [],
  };
  static school = {
    list: [],
  };
  static other = {
    list: [],
  };

  static storeDefaultTask = async () => {
    try {
      const jsonHealthValue = JSON.stringify(this.defaultHealth["list"]);
      await AsyncStorage.setItem("Health", jsonHealthValue);
      const jsonHomeValue = JSON.stringify(this.defaultHome["list"]);
      await AsyncStorage.setItem("Home", jsonHomeValue);
      const jsonSchoolValue = JSON.stringify(this.defaultSchool["list"]);
      await AsyncStorage.setItem("School", jsonSchoolValue);
      const jsonOtherValue = JSON.stringify(this.defaultOther["list"]);
      await AsyncStorage.setItem("Other", jsonOtherValue);
      this.health = this.defaultHealth;
      this.home = this.defaultHome;
      this.school = this.defaultSchool;
      this.other = this.defaultOther;
    } catch (e) {
      console.error(e);
    }
  };

  static updateLists = async () => {
    if (this.health.length != 0) {
      try {
        const jsonHealthValue = await AsyncStorage.getItem("Health");
        this.health["list"] = JSON.parse(jsonHealthValue);
        const jsonHomeValue = await AsyncStorage.getItem("Home");
        this.home["list"] = JSON.parse(jsonHomeValue);
        const jsonSchoolValue = await AsyncStorage.getItem("School");
        this.school["list"] = JSON.parse(jsonSchoolValue);
        const jsonOtherValue = await AsyncStorage.getItem("Other");
        this.other["list"] = JSON.parse(jsonOtherValue);
        console.log(this.health);
        return true;
      } catch (error) {
        console.error(error);
      }
      return false;
    }
  };
  // pass in the name of the category_id: Health, Home, School, Other
  static getCategory = (category) => {
    switch (category) {
      case "Health":
        return this.health["list"];
      case "Home":
        return this.home["list"];
      case "School":
        return this.school["list"];
      case "Other":
        return this.other["list"];
      default:
        break;
    }
    return null;
  };

  static addTaskIntoCateogry = async (value, category) => {
    try {
      let jsonValue = null;
      switch (category) {
        case "Health":

          this.health["list"].push(value);
          jsonValue = JSON.stringify(this.health["list"]);
          break;
        case "Home":
          this.home["list"].push(value);
          jsonValue = JSON.stringify(this.home["list"]);
          break;
        case "School":
          this.school["list"].push(value);
          jsonValue = JSON.stringify(this.school["list"]);
          break;
        case "Other":
          this.other["list"].push(value);
          jsonValue = JSON.stringify(this.other["list"]);
          break;
        default:
          return null;
      }
      return await AsyncStorage.setItem(category, jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  static removeCategories = async () => {
    try {
      const keys = ["Health", "Home", "School", "Other"];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error(error);
    }
  };

  //testing purpose
  static printCategory = async (category) => {
    try {
      switch (category) {
        case "Health":
          const jsonHealthValue = await AsyncStorage.getItem("Health");
          let jsonHealth = JSON.parse(jsonHealthValue);
          console.log(jsonHealth);
          break;
        case "Home":
          const jsonHomeValue = await AsyncStorage.getItem("Home");
          let jsonHome = JSON.parse(jsonHomeValue);
          console.log(jsonHome);
          break;
        case "School":
          const jsonSchoolValue = await AsyncStorage.getItem("School");
          let jsonSchool = JSON.parse(jsonSchoolValue);
          console.log(jsonSchool);
          break;
        case "Other":
          const jsonOtherValue = await AsyncStorage.getItem("Other");
          let jsonOther = JSON.parse(jsonOtherValue);
          console.log(jsonOther);
          break;
        default:
          console.log("Category not detected");
      }
    } catch (error) {
      console.error(e);
    }
  };
}
