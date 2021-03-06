/**
 * Goes through a given assistant via it's id and returns
 * all tasks associated with assistant.
 * 
 * @param {string} assistantUid - id of assistant you want to get task ids of
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Array.<string>} - List of tasks ids 
 */
async function getTasks(assistantUid, client){
    var allTasks = []
    await client.autopilot.assistants(assistantUid)
                .tasks
                .list()
                .then(tasks => tasks.forEach(t => allTasks.push(t.sid)));
    return allTasks
}

/**
 * Removes specified task.
 * 
 * @param {string} assistantUid - Twilio assistant id.
 * @param {string} taskUid - task id of task you want removed .
 * @param {Object} client - Twilio API client object.
 */
async function deleteTask(assistantUid, taskUid, client){
    await client.autopilot.assistants(assistantUid)
                .tasks(taskUid)
                .remove();
}

/**
 * Goes through each and every task
 * and calls for task to be deleted.
 * 
 * @param {string} assistantUid - Twilio assistant id.
 * @param {Array.<string>} tasks - all tasks to be removed at given assistant.
 * @param {Object} client - Twilio API client object.
 */
async function removeTasks(assistantUid, tasks, client){
    for(var i in tasks){
        await deleteTask(assistantUid, tasks[i], client)
    }
}



module.exports = {getTasks, deleteTask, removeTasks}