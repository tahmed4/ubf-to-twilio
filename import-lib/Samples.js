/**
 * List all samples for given task.
 * 
 * @param {string} assistantUid - Twilio assistant id.
 * @param {string} taskUid - Twilio task id.
 * @param {Object} client - Twilio API client object.
 */
async function listSamples(assistantUid, taskUid, client){
    client.autopilot.assistants(assistantUid)
                .tasks(taskUid)
                .samples
                .list()
}

/**
 * Returns all the samples for a specific task of an assistant
 * 
 * @param {string} assistantUid - id of assistant you want sample ids of.
 * @param {string} taskUid - the specific task you want to collect the sample ids of.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Array.<string>}
 */
async function getSamples(assistantUid, taskUid, client){
    var allSamples = []
    await client.autopilot.assistants(assistantUid)
    .tasks(taskUid)
    .samples
    .list()
    .then(samples => samples.forEach(s => allSamples.push(s.sid)));
    return allSamples
}

/**
 * Delete specified sample at given task and assistant
 * 
 * @param {string} assistantUid - Twilio assistant id.
 * @param {string} taskUid  - Specific task id at which the sample exists.
 * @param {string} sampleUid - The sample id of the sample you want to remove.
 * @param {Object} client - Twilio API client object.
 */
async function deleteSample(assistantUid, taskUid, sampleUid, client){
    await client.autopilot.assistants(assistantUid)
                .tasks(taskUid)
                .samples(sampleUid)
                .remove();
}

/**
 * Goes through each and every task for a given bot
 * and calls to remove any samples within task.
 * 
 * @param {string} assistantUid - id of assistant you want samples removed from
 * @param {Array.<string>} tasks - all tasks at given assistant
 * @param {Object} client - Twilio API client object.
 */
async function removeSamples(assistantUid, tasks, client){
    for(var i in tasks){
        var samples = await getSamples(assistantUid, tasks[i], client)
        for(var y in samples){
                await deleteSample(assistantUid, tasks[i], samples[y], client)
            }
    }
}

/**
 * Creates sample at given task.
 * 
 * @param {string} taskSid - Task id where sample should be created.
 * @param {string} assistantUid - Twilio assistant id.
 * @param {string} text - Sample text.
 * @param {Object} client - Twilio API client object.
 */
async function createSample(taskSid, assistantUid, text, client){
    await client.autopilot.assistants(assistantUid)
                .tasks(taskSid)
                .samples
                .create({language: 'en-US', taggedText: text})
}

module.exports = {listSamples, getSamples, deleteSample, removeSamples, createSample}