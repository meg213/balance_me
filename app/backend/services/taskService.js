const axios = require('axios');
const urlbase = 'https://balance-me-proj.herokuapp.com';
// const urlbase = 'http://localhost:3000';

exports.getAllTasks = async () => {

    try {
        var tasks = await axios.get(urlbase + '/tasks').then((response) => {

            return response.data;
        
        });

        return tasks;
    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.createTask = async (
    name,
    point_value, 
    category_id, 
    estimated_time, 
    description,
    start_time,
    estimated_completion_time,
    status,
    image_path,
    assigned_user_id,
    created_user_id
) => {


    if (!image_path) {
        image_path = "temp_path.jpg"
    }
    try {
        var task = await axios.post(urlbase + '/createTask', 
        {
            data: {
                name,
                point_value, 
                category_id, 
                estimated_time, 
                description,
                start_time,
                estimated_completion_time,
                status,
                image_path,
                assigned_user_id,
                created_user_id
            }
        }).then(task => {
            return task.data;
        })

        return task

    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.getTask = async (task_id) => {

    try {
      var task = await axios.get(urlbase + '/getTask', 
        { 
            params: {
                task_id
            }
        }).then(task => {
            return task.data;
        })
  
      return task
  
    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.updateTask = async (task_id, data) => {

    try {
        var task = await axios.post(urlbase + '/updateTask', 
        { 
            task_id,
            data
        }).then(task => {
            return task.data;
        })

        return task

    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.assignTask = async (assigned_email, task_id) => {

    try {
        var task = await axios.post(urlbase + '/assignTask', 
        { 
            assigned_email,
            task_id
        }).then(task => {
            return task.data
        })

        return task

    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.getAssignedUser = async (task_id) => {

    try {
        var user = await axios.get(urlbase + '/getAssignedUser', 
        { 
            params: {
                task_id
            }
        }).then(user => {
            return user.data
        })

        return user

    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.getCreatedUser = async (task_id) => {

    try {
        var user = await axios.get(urlbase + '/getCreatedUser', 
        { 
            params: {
                task_id
            }
        }).then(user => {
            return user.data;
        })

        return user

    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}

exports.updateTaskHistory = async (task_id, history_log) => {

    try {
        var task = await axios.post(urlbase + '/updateTaskHistory', 
        { 
            task_id,
            history_log
        }).then(task => {
            return task.data
        })

        return task

    } catch (e) {
        console.log({status: e.response.status, message: e.response.data.error})
    }
}