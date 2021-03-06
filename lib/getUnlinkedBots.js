const log = require("log");
const Assistants = require("../import-lib/Assistants.js")
const Numbers = require("../import-lib/Numbers.js")
/**
 * Fetches a list of all bots that are currently sitting on
 * Twilio servers but are not linked to a phone number.
 *
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Object[]} - list of unlinked bots. `null` on error case.
 */
async function getUnlinkedBots(client) {
  try {
    var linkedAssistants = await Numbers.getLinkedAssistants(client)
    var bot_data = await Assistants.getAssistants(client)
  } catch (e) {
    log.error(e);
    return null
  }
  var assistants = bot_data.assistants
  var bots = bot_data.allBots
  var unlinkedBots = []

  try {
    const unlinkedAssistants = assistants.filter(function(x) { 
      return linkedAssistants.indexOf(x) < 0;
    });

    for(var i in bots){
      if(unlinkedAssistants.includes(bots[i].id)){
          unlinkedBots.push(bots[i])
      }
    }
  } catch(e){
    log.error(e);
    return null
  }

  return unlinkedBots
}

module.exports = {getUnlinkedBots};