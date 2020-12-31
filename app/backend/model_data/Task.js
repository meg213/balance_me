const taskService = require("../services/taskService");
// const User = require("../model_data/User")

module.exports = class Task {
    constructor(
        id,
        name,
        point_value, 
        category_id, 
        estimated_time, 
        description,
        start_time,
        estimated_completion_time,
        status,
        completion_time,
        image_path,
        assigned_user_id, 
        created_user_id,
        history,
        repeat,
        completed,
        active,
        steps
    ) {
        this.id = id;
        this.name = name;
        this.point_value = point_value;
        this.category_id = category_id; 
        this.estimated_time = estimated_time;
        this.description = description;
        this.start_time = start_time;
        this.estimated_completion_time = estimated_completion_time;
        this.status = status;
        this.completion_time = completion_time;
        this.image_path = image_path;
        this.assigned_user_id = assigned_user_id;
        this.created_user_id = created_user_id;
        this.history = history;
        this.repeat = repeat;
        this.completed = completed;
        this.active = active;
        this.steps = steps;
    };
    // getAssignedUser = async function() {
    //     try {
    //         var user = await taskService.getAssignedUser(this.id)
    //         .then(user => { return user });

    //         var return_user = new User(
    //             user.user_id,
    //             user.first_name,
    //             user.last_name,
    //             user.account_type,
    //             user.password,
    //             user.email,
    //             user.points
    //         )

    //         return return_user;

    //     } catch (e) {
    //         console.log(e);
    //         return false;
    //     }
    // };

    // getCreatedUser = async function() {
    //     try {
    //         var user = await taskService.getCreatedUser(this.id)
    //         .then(user => { return user });

    //         var return_user = new User(
    //             user.user_id,
    //             user.first_name,
    //             user.last_name,
    //             user.account_type,
    //             user.password,
    //             user.email,
    //             user.points
    //         )

    //         return return_user;
            
    //     } catch (e) {
    //         console.log(e);
    //         return false;
    //     }
    // }
    
    setComplete = async function(complete) {
        var data = {
            completed: complete
        }
        try {
            var task = await taskService.updateTask(this.id, data)
            .then(task => { return task });

            this.id = task.task_id;
            this.name = task.name;
            this.point_value = task.point_value;
            this.category_id = task.category_id; 
            this.estimated_time = task.estimated_time;
            this.description = task.description;
            this.start_time = task.start_time;
            this.estimated_completion_time = task.estimated_completion_time;
            this.status = task.status;
            this.completion_time = task.completion_time;
            this.image_path = task.image_path;
            this.assigned_user_id = task.assigned_user_id;
            this.created_user_id = task.created_user_id;
            this.history = task.history;
            this.repeat = task.repeat;
            this.completed = task.completed;
            this.active = task.active;
            this.steps = task.steps;

            return this;
        } catch (e) {
            console.log(e);
            return false;
        }
    }


    setStatus = async function(status) {
        var data = {
            status: status
        }
        try {
            var task = await taskService.updateTask(this.id, data)
            .then(task => { return task });

            this.id = task.task_id;
            this.name = task.name;
            this.point_value = task.point_value;
            this.category_id = task.category_id; 
            this.estimated_time = task.estimated_time;
            this.description = task.description;
            this.start_time = task.start_time;
            this.estimated_completion_time = task.estimated_completion_time;
            this.status = task.status;
            this.completion_time = task.completion_time;
            this.image_path = task.image_path;
            this.assigned_user_id = task.assigned_user_id;
            this.created_user_id = task.created_user_id;
            this.history = task.history;
            this.repeat = task.repeat;
            this.completed = task.completed;
            this.active = task.active;
            this.steps = task.steps;

            return this;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    update = async function(
        name,
        point_value, 
        category_id, 
        estimated_time, 
        description,
        start_time,
        estimated_completion_time,
        status,
        completion_time,
        image_path,
        assigned_user_id, 
        created_user_id,
        history,
        repeat,
        completed,
        active,
        steps
    ) {
        var data = {
            name: name,
            point_value: point_value, 
            category_id: category_id, 
            estimated_time: estimated_time, 
            description: description,
            start_time: start_time,
            estimated_completion_time: estimated_completion_time,
            status: status,
            completion_time: completion_time,
            image_path: image_path,
            assigned_user_id: assigned_user_id, 
            created_user_id: created_user_id,
            history: history,
            repeat: repeat,
            completed: completed,
            active: active,
            steps: steps
        }
        try {
            var task = await taskService.updateTask(this.id, data)
            .then(task => { return task });

            this.id = task.task_id;
            this.name = task.name;
            this.point_value = task.point_value;
            this.category_id = task.category_id; 
            this.estimated_time = task.estimated_time;
            this.description = task.description;
            this.start_time = task.start_time;
            this.estimated_completion_time = task.estimated_completion_time;
            this.status = task.status;
            this.completion_time = task.completion_time;
            this.image_path = task.image_path;
            this.assigned_user_id = task.assigned_user_id;
            this.created_user_id = task.created_user_id;
            this.history = task.history;
            this.repeat = task.repeat;
            this.completed = task.completed;
            this.active = task.active;
            this.steps = task.steps;

            return this;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    assignTo = async function(email) {
        try {
            var task = await taskService.assignTask(email, this.id)
            .then(task => { return task });

            this.assigned_user_id = task.assigned_user_id;
            return this;

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    updateHistory = async function(
        start_time,
        estimated_completion_time,
        status,
        completion_time,
        completed,
        points_awarded
    ) {
        var history_log = {
            start_time: start_time,
            estimated_completion_time: estimated_completion_time,
            status: status,
            completion_time: completion_time,
            completed: completed,
            points_awarded: points_awarded
        }

        try {
            var task = await taskService.updateTaskHistory(this.id, history_log)
            .then(task => { return task });

            this.history = task.history;
            return this;

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    updateStepsAndRepeat = async function(
        steps,
        repeat
    ) {
        var data = {
            steps: steps,
            repeat: repeat
        }

        try {
            var task = await taskService.updateTask(this.id, data)
            .then(task => { return task });

            this.steps = task.steps;
            this.repeat = task.repeat;

            return this;

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    updateStartTime = async function(
        start_time
    ) {
        var data = {
            start_time: start_time,
            estimated_completion_time: start_time + this.estimated_time
        }

        try {
            var task = await taskService.updateTask(this.id, data)
            .then(task => { return task });

            this.start_time = task.start_time;
            this.estimated_completion_time = task.estimated_completion_time;
            
            return this;

        } catch (e) {
            console.log(e);
            return false;
        }
    }
}