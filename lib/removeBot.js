const validate = require("../import-lib/validate.js")
const Samples = require("../import-lib/Samples.js")
const {ValidationError, TwilioRequestError} = require('../import-lib/Exceptions.js');
const Tasks = require("../import-lib/Tasks.js")
const Assistants = require("../import-lib/Assistants.js")
const Services = require("../import-lib/Services.js")

/**
 * Removes live bot by deleting assistant and service
 * that sits on Twilio Autopilot and Twilio Functions.
 * 
 * @param {Object} client - Twilio API client object.
 * @param {string} id - Twilio Assistant id of bot to be removed.
 * 
 * @returns {boolean} - `true` if bot successfully removed.
 * 
 * @throws {ValidationError} - If bot trying to be removed doesn't exist.
 * @throws {TwilioRequestError} - If requests to Twilio to remove bot fail.
 */
async function removeBot(client, id) {
    /**
     * Contains all calls to remove assistant.
     * First remove samples then remove tasks and
     * then delete assistant. No sample can or task
     * can exist before deleting an assistant.
     * 
     * 
     * @param {string} assistantUid - Twilio assistant id.
     * @param {Object} client - Twilio API client object.
     */
    async function removeAssistant(assistantUid, client){
        var tasks = await Tasks.getTasks(assistantUid, client)
        await Samples.removeSamples(assistantUid, tasks, client)
        await Tasks.removeTasks(assistantUid, tasks, client)
        await Assistants.deleteAssistant(assistantUid, client)
    }
    
    /**
     * Remove a specific service.
     * 
     * @param {string} assistantName 
     * @param {Object} client - Twilio API client object.
     */
    async function removeService(assistantName, client){
        var serviceUid = await Services.getServiceUid(assistantName, client)
        await Services.deleteService(serviceUid, client)
        
    }

    if(typeof(client) !== "object" || client === null){
        throw new TwilioRequestError("Missing Client")
    }
    
    try {
        var assistantName = await Assistants.getAssistantName(id, client)
        //checks to ensure the service and assistant exists before deleting
        if((await validate.serviceNameAvaialble(client, assistantName)) === true){
            throw new ValidationError("Service associated with bot doesn't exist")
        } else if ((await validate.assistantNameAvailable(client, assistantName)) === true){
            throw new ValidationError("Bot doesn't exist")
        }

        await removeService(assistantName, client)
        await removeAssistant(id, client)
    } catch (e){
        throw new TwilioRequestError(e.message)
    }

    return true
  }

module.exports = {removeBot};
