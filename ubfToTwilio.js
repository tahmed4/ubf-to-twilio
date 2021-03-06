const log = require("log");

const connect = require("./lib/tryConnectingToTwilio")
const phonenumbers =  require("./lib/getSMSAccountPhoneNumbers")
const deployed = require("./lib/getDeployedBots")
const remove =  require("./lib/removeBot")
const changeNumber =  require("./lib/changeBotPhoneNumber")
const upload =  require("./lib/uploadNewBot")
const simulate =  require("./lib/simulateBot")
const unlinked =  require("./lib/getUnlinkedBots")

class Api {

  /**
   * Attempts to connect to Twilio with your 
   * Account Sid and Auth Token from twilio.com/console
   * returning twilio client object on success.
   * 
   * @param {string} twilioAccountSid - the Twilio Account ID.
   * @param {string} twilioAuthToken - the Twilio Auth Token.
   * 
   * @returns {Object} - client object to do API calls. `null` on error case.
   */
  async tryConnectingToTwilio(twilioAccountSid, twilioAuthToken) {
      var client = await connect.twilioConnect(twilioAccountSid, twilioAuthToken)
      return client
  }

  /**
   * Returns all phone numbers under this account's control
   * including numbers that are currently in use by bots
   * or available. 
   * 
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {string[]} - all phonenumbers on twilio Account. `null` on error case.
   */
  async getSMSAccountPhoneNumbers(client) {
    return (await phonenumbers.getSMSAccountPhoneNumbers(client))
  
  }
  

  /**
   * Returns a list of fully initialised bots except
   * for bot.diagram which are currently running live
   * on Twilio.
   * 
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {Object[]} - All fully initialised, except for diagram, live bots. `null` on error case.
   */
  async getDeployedBots(client) {
      return(await deployed.getDeployedBots(client))
  
  }
  
  /**
   * Creates a service and assistant using provided bot.name and
   * breaks down bot.diagram into Twilio tasks and uploads them
   * alongside mapping and handling files to Twilio.
   * 
   * 
   * @param {Object} client -  Twilio API client object.
   * @param {Object} bot - Defined bot that is about to be uploaded.
   * 
   * @returns {string} - Twilio assistant unique id. `null` on error case.
   */
  async uploadNewBot(client, bot) {
      if(bot == null){
        return null
      }
      return (await upload.uploadNewBot(client, bot))
  }
  
  
  /**
   * Removes live bot by deleting assistant and service
   * that sits on Twilio Autopilot and Twilio Functions.
   * 
   * @param {Object} client - Twilio API client object.
   * @param {string} id - Twilio Assistant id of bot to be removed.
   * 
   * @returns {boolean} - `true` if bot successfully removed, otherwise `false`
   */
  async removeBot(client, id) {
      return await remove.removeBot(client, id)
  }
  
  /**
   * Links a bot to a phone number by updating
   * target webhook. Will overwrite webhook if one exists at the number 
   * and if bot is currently linked with a number, it will be unlinked and 
   * freed.
   * 
   * 
   * @param {Object} client - Twilio API client object.
   * @param {string} id - id of assistant that is going to be associated with number.
   * @param {string} number - Desired phone number for assistant to be linked to. e.g ("+447123456789")
   * 
   * @returns {boolean} `true` if number successfully changed, otherwise `false`
   */
  async changeBotPhoneNumber(client, id, number) {
    return changeNumber.changeBotPhoneNumber(client, id, number)
  }


  /**
   * Sends text to a desired bot and text simulating the real
   * SMS conversation will be returned.
   * 
   * @param {Object} client - Twilio API client object.
   * @param {string} id - id of assistant which you want to simulate.
   * @param {string} text - text message which you want to send to the bot.
   * 
   * @returns {string[]} - text responses from simulated bot. `null` on error case.
   */
  async simulateBot(client, id, text){
    log.info("Simulating bot with text '" + text + "'")
    var simulatedText = await simulate.simulateBot(client, id, text)
    return simulatedText

  }

  /**
   * Fetches a list of all bots that are currently sitting on
   * Twilio servers but are not linked to a phone number.
   *
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {Object[]} - list of unlinked bots. `null` on error case.
   */
  async getUnlinkedBots(client){
    return (await unlinked.getUnlinkedBots(client))
  }

}

const api = new Api()

module.exports = api;
