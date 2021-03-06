
/**
 * Retrieve all Twilio assistants as well as their bot definitions.
 * 
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Object} - Containing all bots as well as assistant ids.
 */
async function getAssistants(client){
    var bots = []
    var allAssistants = []
    await client.autopilot.assistants
      .list()
      .then(assistants => assistants.forEach(a => { 
          var bot = {"phoneNumber": null, "name": null, "id": null, "diagram": null, "timestamp": null}
          bot.id = a.sid
          if(a.uniqueName.split(/-(.+)/)[1] !== undefined && !isNaN((a.uniqueName.split(/-(.+)/)[0]))){
              bot.timestamp = a.uniqueName.split(/-(.+)/)[0]
              bot.name = a.uniqueName.split(/-(.+)/)[1]
          } else{
              bot.name = a.uniqueName
          }
          bots.push(bot)
          allAssistants.push(a.sid)
      }));
    return {
        allBots: bots,
        assistants: allAssistants
    }
}

/**
 * Create a Twilio Assistant
 * 
 * @param {string} name - name you want to assign to the bot.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - Twilio assistant id.
 */
async function createAssistant(name, client){
    var assistantUid = ""
    await client.autopilot.assistants
                .create({
                    friendlyName: name,
                    uniqueName: name
                    })
                .then(assistant => assistantUid = assistant.sid);
    return assistantUid 
}

/**
 * Creates model for specific assistant
 *
 * @param {string} assistantUid - Twilio assistant id.
 * @param {Object} client - Twilio API client object.
 * 
 */
async function createModel(assistantUid, client){
    await client.autopilot.assistants(assistantUid)
                .modelBuilds
                .create()
}

/**
 * Set default parameters for a twilio assistant. 
 * i.e which is the initial task, which task to fall
 * back to if there is a problem understanding input etc..
 * 
 * @param {string} assistantUid - Twilio assistant id.
 * @param {Object} client - Twilio API client object.
 */
async function setDefaults(assistantUid, client){
    await client.autopilot.assistants(assistantUid)
                .defaults()
                .update({defaults: {
                   defaults: {
                     assistant_initiation: 'task://greeting',
                     fallback: 'task://fallback',
                     collect: {
                        validate_on_failure: "task://collect_fallback"
                    }
                   }
                 }})
}


/**
 * Return the friendly name of an assistant from
 * specified assistant id.
 * 
 * @param {string} assistantUid - Twilio assistant id for the bots name you want to retrieve.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - friendly name of assistant
 */
async function getAssistantName(assistantUid, client){
    var friendlyName = ""
    await client.autopilot.assistants(assistantUid)
                .fetch()
                .then(assistant => friendlyName = assistant.friendlyName);
    return friendlyName
}

/**
 * Delete specific assistant.
 * 
 * @param {string} assistantUid 
 * @param {Object} client - Twilio API client object. 
 */
async function deleteAssistant(assistantUid, client){
    await client.autopilot.assistants(assistantUid).remove();
}


module.exports = {getAssistants, createAssistant, setDefaults, createModel, getAssistantName, deleteAssistant}