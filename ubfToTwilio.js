const connect = require("./lib/tryConnectingToTwilio")
const phonenumbers =  require("./lib/getSMSAccountPhoneNumbers")
const deployed = require("./lib/getDeployedBots")
const remove =  require("./lib/removeBot")
const changeNumber =  require("./lib/changeBotPhoneNumber")
const upload =  require("./lib/uploadNewBot")
const simulate =  require("./lib/simulateBot")
const unlinked =  require("./lib/getUnlinkedBots")
const unlinkNumber =  require("./lib/unlinkFromNumber")

class Api {

  /**
   * Attempts to connect to Twilio with your 
   * Account Sid and Auth Token from twilio.com/console
   * returning twilio client object on success.
   * 
   * @param {string} twilioAccountSid - the Twilio Account ID.
   * @param {string} twilioAuthToken - the Twilio Auth Token.
   * 
   * @returns {Object} - client object to do API calls. `null` if login details were invalid.
   * 
   * @throws {TwilioRequestError} - If twilio request to login fails.
   */
  async tryConnecting(authoptions) {
      var client = await connect.twilioConnect(authoptions.username, authoptions.password)
      return client
  }

  /**
   * Returns all phone numbers under this account's control
   * including numbers that are currently in use by bots
   * or available.
   * 
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {string[]} - all phonenumbers on twilio Account.
   * 
   * @throws {TwilioRequestError} - If retrieving account phone numbers fail.
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
   * @returns {Object[]} - All fully initialised, except for diagram, live bots. 
   * 
   * @throws {TwilioRequestError} - If Twilio request to get numbers or bot data fails.
   * @throws {Error} - If numbers or data retrieved are empty.
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
   * @returns {string} - Twilio assistant unique id. 
   * 
   * @throws {ValidationError} - If bot definition is missing any data.
   */
  async uploadNewBot(client, bot) {
      return (await upload.uploadNewBot(client, bot))
  }
  
  
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
   * @returns {boolean} - `true` if number successfully changed.
   * 
   * @throws {TwilioRequestError} - throws error if number didn't change successfully
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
   * @returns {string[]} - text responses from simulated bot. 
   * 
   * @throws {TwilioRequestError} - If request to get simulated text fails.
   */
  async simulateBot(client, id, text){
    var simulatedText = await simulate.simulateBot(client, id, text)
    return simulatedText

  }

  /**
   * Fetches a list of all bots that are currently sitting on
   * Twilio servers but are not linked to a phone number.
   *
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {Object[]} - list of unlinked bots.
   * 
   * @throws {TwilioRequestError} - If retrieving bot data fails.
   * @throws {Error} - If data retrieved is empty.
   */
  async getUnlinkedBots(client){
    return (await unlinked.getUnlinkedBots(client))
  }

  /**
   * Unlinks a phone number from an assistant by wiping 
   * the SMS url webhook on a specific phone number and
   * sets the number as a free-number.
   * 
   * @param {Object} client - Twilio API client object.
   * @param {string} id - id of assistant that is going to be unlinked.
   * 
   * @returns {boolean} - `true` if number successfully changed. `false` otherwise.
   * 
   * @throws {TwilioRequestError} - throws error if request fails
   */
  async unlinkFromNumber(client, id){
    return (await unlinkNumber.unlinkFromPhoneNumber(client, id))
  }

}

const api = new Api()

module.exports = api;
