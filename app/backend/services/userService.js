const axios = require('axios');
const urlbase = 'https://balance-me-proj.herokuapp.com';
const Task = require("../model_data/Task");

exports.getAllUsers = async () => {
  try {
    var users = await axios.get(urlbase + '/users')
    .then((response) => {

      return response.data;
      
    });

    return users;
  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
  }
}

exports.createUser = async (first_name, last_name, account_type, password, email) => {

  try {
    var user = await axios.post(urlbase + '/createUser', 
      { first_name,
        last_name,
        account_type, 
        password, 
        email
      }).then(user => {
        return user.data;
      })

      return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
    return {status: e.response.status, message: e.response.data.error};
  }
}

exports.getUser = async (email) => {
  try {
    var user = await axios.get(urlbase + '/getUser', 
      { 
        params: {
          email
        }
      }
      ).then(user => {
        return user.data
      })

      return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error, location: "userService.getUser()"})
    return {status: e.response.status, message: e.response.data.error, location: "userService.getUser()"};
  }
}

exports.updateEmail = async (old_email, new_email, password) => {

  try {
    var user = await axios.post(urlbase + '/updateEmail', 
      { 
        old_email,
        new_email,
        password
      }).then(user => {
        return user.data
      })

      return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
  }
}

exports.getAssignedTasks = async (email) => {

  try {
    var tasks = await axios.get(urlbase + '/getAllAssignedTasks', 
      { 
        params: {
          email
        }
      }).then(tasks => {
        return tasks.data
      })

    return tasks;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error, location: "userService.getAssignedTasks()"})
  }
}

exports.getCreatedTasks = async (email) => {

  try {
    var tasks = await axios.get(urlbase + '/getAllCreatedTasks', 
      { 
        params: {
          email
        }
      }).then(tasks => {
        return tasks.data
      })

    return tasks;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error, location: "userService.getCreatedTasks()"})
  }
}

exports.updatePoints = async (email, points) => {

  try {
    var user = await axios.post(urlbase + '/updatePoints', 
      { 
        email,
        points
      }).then(user => {
        return user.data
      })

    return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
  }
}

exports.updateFirstName = async (email, first_name) => {

  try {
    var user = await axios.post(urlbase + '/updateFirstName', 
      { 
        email,
        first_name
      }).then(user => {
        return user.data
      })

    return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
  }
}

exports.updateLastName = async (email, last_name) => {

  try {
    var user = await axios.post(urlbase + '/updateLastName', 
      { 
        email,
        last_name
      }).then(user => {
        return user.data
      })

    return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
  }
}

exports.getDailyTasks = async (email, start_time, end_time) => {

  try {
    var tasks = await axios.get(urlbase + '/getDailyTasks', 
      { 
        params: {
          email,
          start_time,
          end_time
        }
      }).then(tasks => {
        return tasks.data
      })

      var all_tasks = [];
      for (var curr_task in tasks) {
          var task = tasks[curr_task];
          var new_task = new Task(
              task._id,
              task.name,
              task.point_value,
              task.category_id, 
              task.estimated_time,
              task.description,
              task.start_time,
              task.estimated_completion_time,
              task.status,
              task.completion_time,
              task.image_path,
              task.assigned_user_id,
              task.created_user_id,
              task.history,
              task.repeat,
              task.completed,
              task.active,
              task.steps
          );
          all_tasks.push(new_task)
      }

      return all_tasks;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error, location: "userService.getDailyTasks()"})
  }
}

exports.loginUser = async (email, password) => {
  try {
    var user = await axios.get(urlbase + '/loginUser', 
      { 
        params: {
          email,
          password
        }
      }
      ).then(user => {
        return user.data
      })

      return user;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error, location: "userService.loginUser()"})
    return {status: e.response.status, message: e.response.data.error, location: "userService.loginUser()"};
  }
}

exports.deleteUser = async (email) => {
  try {
    var val = await axios.delete(urlbase + '/deleteUser', 
      { 
        data: {
          email
        }
      }).then(val => {
        return val.data
      })
    return val;

  } catch (e) {
    console.log({status: e.response.status, message: e.response.data.error})
  }
}