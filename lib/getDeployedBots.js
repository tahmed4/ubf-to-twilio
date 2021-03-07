const {TwilioRequestError} = require('../import-lib/Exceptions.js');
const Assistants = require("../import-lib/Assistants.js")
const Numbers = require("../import-lib/Numbers.js")

/**
 * Returns a list of fully initialised bots except
 * for bot.diagram which are currently running live
 * on Twilio.
 * 
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Object[]} - All fully initialised, except for diagram, live bots. 
 * 
 * @throws {TwilioRequestError} - If Twilio request to get numbers or bot data fails.
 * @throws {Error} - If numbers or data retrieved are empty.
 */
async function getDeployedBots(client) {
    var deployed_bots = []
    var active_bots = []
    try {
        var numbers = await Numbers.getNamesToNumber(client)
        var bot_data = await Assistants.getAssistants(client)
    } catch (e) {
        throw TwilioRequestError(e)
    }

    var assistants = bot_data.assistants
    var bots = bot_data.allBots
    
    try {
        for(var key in numbers){
            if(assistants.includes(key)){
                active_bots.push(key)
            }
        }
        for(var i in bots){
            if(active_bots.includes(bots[i].id)){
                bots[i].phoneNumber = numbers[bots[i].id]
                deployed_bots.push(bots[i])
            }
        }
    } catch (e) {
        throw Error(e)
    }
    
    return deployed_bots
     
  }

module.exports = {getDeployedBots};
