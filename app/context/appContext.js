import createDataContext from './createDataContext';
import User from '../backend/model_data/User';
import Task from '../backend/model_data/Task';
import userService from '../backend/services/userService';
const axios = require('axios');
const urlbase = 'https://balance-me-proj.herokuapp.com';


const authReducer = (state, action) => {
    switch(action.type) {
        case 'fetch_data':
            // return {...state, user: action.user, assigned_tasks: action.assigned_tasks, created_tasks: action.created_tasks, daily_tasks: action.daily_tasks}
            return {...state, user: action.user, daily_tasks: action.daily_tasks}
        case 'fetch_daily_tasks':
            return {...state, daily_tasks: action.daily_tasks}
        case 'minute_update_daily_tasks':
            return {...state, daily_tasks: action.daily_tasks}
        case 'login_user':
            return {...state, user: action.user, login_err_msg: {}}
        case 'login_error':
            return {...state, login_err_msg: action.login_err_msg}
        case 'delete_user':
            return {...state, user: action.user}
        case 'add_error':
            return {...state, error_message: action.error_message}
        default: 
            return state;
    }
}

const fetchData = (dispatch) => {
    return async(email) => {
        //call to local storage, not remote but until then:
        var userData = await userService.getUser(email)
        .then(user => { return user; });

        var user = new User(userData.user_id, userData.first_name, userData.last_name, userData.account_type,
            userData.password, userData.email, userData.points);
        
        // var assigned_tasks = await user.getAssignedTasks().then(tasks => { return tasks; });

        // var created_tasks = await user.getCreatedTasks().then(tasks => { return tasks; });

        var daily_tasks = await user.getDailyTasks().then(tasks => { return tasks; });

        // dispatch({type: 'fetch_data', user: user, assigned_tasks: assigned_tasks, created_tasks: created_tasks, daily_tasks: daily_tasks})
        dispatch({type: 'fetch_data', user: user, daily_tasks: daily_tasks})
    }
}

const fetchDailyTasks = (dispatch) => {
    return async(email) => {
        var start = new Date();
        start.setHours(0,0,0,0);
        start = (start.getTime() / 1000);

        var end = new Date();
        end.setHours(23,59,59,0);
        end = (end.getTime() / 1000);

        var daily_tasks = await userService.getDailyTasks(
            email, start, end
        ).then(tasks => { return tasks; });

        dispatch({type: 'fetch_daily_tasks', daily_tasks: daily_tasks})
    }
}

const minuteUpdateDailyTasks = (dispatch) => {
    return async(email) => {
        var start = new Date();
        start.setHours(0,0,0,0);
        start = (start.getTime() / 1000);

        var end = new Date();
        end.setHours(23,59,59,0);
        end = (end.getTime() / 1000);

        var currTime = new Date();
        currTime = currTime.getTime() / 1000;

        var daily_tasks = await userService.getDailyTasks(
            email, start, end
        ).then(tasks => { return tasks; });
        

        for (var task in daily_tasks) {
            //upcoming -> in progress
            var currTask = daily_tasks[task];
            if ((currTask.start_time <= currTime) && (currTask.estimated_completion_time > currTime) && (!currTask.completed)) {
                var data = {
                    "status": 1,
                }
                var task_id = currTask.id;
                try {
                    await axios.post(urlbase + '/updateTask',
                    { 
                        task_id,
                        data
                    }).then((response) => {
                    return response;
                    });
                } catch (e) {
                    console.log(e)
                } 
            }
            //in progress -> overdue
            if ((currTime >= currTask.estimated_completion_time) && (currTime <= (currTask.estimated_completion_time + 3600)) && (!currTask.completed)) {
                var data = {
                    "status": 0,
                }
                var task_id = currTask.id;
                try {
                    await axios.post(urlbase + '/updateTask',
                    { 
                        task_id,
                        data
                    }).then((response) => {
                    return response;
                    });
                } catch (e) {
                    console.log(e)
                } 
            }
            //overdue -> missed
            if ((currTime >= (currTask.estimated_completion_time + 3600)) && (!currTask.completed)) {
                var data = {
                    "status": 3,
                }
                var task_id = currTask.id;
                try {
                    await axios.post(urlbase + '/updateTask',
                    { 
                        task_id,
                        data
                    }).then((response) => {
                    return response;
                    });
                } catch (e) {
                    console.log(e)
                } 
            }
        }

        dispatch({type: 'minute_update_daily_tasks', daily_tasks: daily_tasks})
    }
}

const loginUser = (dispatch) => {
    return async(email, password) => {
        var userData = await userService.loginUser(email, password)
        .then(user => { return user});
        
        if (userData.status == 404) {
            dispatch({type: 'login_error', login_err_msg: { "message": userData.message, "status": userData.status }})
        } else if (userData.status == 401) {
            dispatch({type: 'login_error', login_err_msg: { "message": userData.message, "status": userData.status }})
        } else {
            var user = new User(userData._id, userData.first_name, userData.last_name, userData.account_type,
                userData.password, userData.email, userData.points);
            dispatch({type: 'login_user', user: user})
        }
    }
}

const deleteUser = (dispatch) => {
    return async(email) => {
        dispatch({type: 'delete_user', user: new User()})
    }
}

export const {Provider, Context} = createDataContext(
    authReducer,
    {
        fetchData,
        fetchDailyTasks,
        minuteUpdateDailyTasks,
        loginUser,
        deleteUser
    },
    {
        user: null,
        // assigned_tasks: new Task(),
        // created_tasks: new Task(),
        daily_tasks: null,
        error_message: ''
    }
)