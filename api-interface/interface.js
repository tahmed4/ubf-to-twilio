class Api {

  /**
   * Attempts to connect to the backend with your 
   * authentication options
   * returning an authenticated client object on success.
   * this client is to be passed to other API calls.
   * 
   * @param {Object} authoptions  - backend authenthication object
   * 
   * @returns {Object} - client object to do API calls.
   * 
   */
  async tryConnecting(authoptions) {

  }

  /**
   * Returns all phone numbers under this user's control
   * including numbers that are currently in use by bots
   * or available.
   * 
   * @param {Object} client - API client object.
   * 
   * @returns {string[]} - all phone numbers linked to user.
   * 
   */
  async getSMSAccountPhoneNumbers(client) {}
  

  /**
   * Returns a list of fully initialised bots which are 
   * currently running live on your system.
   * 
   * @param {Object} client - API client object.
   * 
   * @returns {Object[]} - All fully initialised live bots. 
   * 
   */
  async getDeployedBots(client) {}
  
  /**
   * Creates a deployed bot from a bot definition.
   * 
   * @param {Object} client -  API client object.
   * @param {Object} bot - Defined bot that is about to be uploaded.
   * 
   * @returns {string} - id of uploaded bot. 
   * 
   */
  async uploadNewBot(client, bot) {}
  
  
  /**
   * Removes bot running on live environment.
   * 
   * @param {Object} client - API client object.
   * @param {string} id - id of bot to be removed.
   * 
   * @returns {boolean} - `true` if bot successfully removed. `false` otherwise
   * 
   */
  async removeBot(client, id) {}
  
  /**
   * Take a deployed bot and assign a phone number to 
   * that specific bot.
   * 
   * @param {Object} client - API client object.
   * @param {string} id - id of bot that is going to be associated with number.
   * @param {string} number - Desired phone number for bot to be linked to. e.g ("+447123456789")
   * 
   * @returns {boolean} - `true` if number successfully changed. `false` otherwise
   * 
   */
  async changeBotPhoneNumber(client, id, number) {}


  /**
   * Sends text to a desired bot and text simulating the real
   * SMS conversation will be returned.
   * 
   * @param {Object} client - API client object.
   * @param {string} id - id of bot which you want to simulate.
   * @param {string} text - text message which you want to send to the bot.
   * 
   * @returns {string[]} - text responses from simulated bot. 
   * 
   */
  async simulateBot(client, id, text){}

  /**
   * Fetches a list of all bots that are currently sitting on
   * the backend servers but are not linked to a phone number.
   *
   * @param {Object} client - API client object.
   * 
   * @returns {Object[]} - list of unlinked bots.
   * 
   */
  async getUnlinkedBots(client){}

  /**
   * Unlinks a phone number from a bot.
   * 
   * @param {Object} client - API client object.
   * @param {string} id - id of bot that is going to be unlinked.
   * 
   * @returns {boolean} - `true` if number successfully changed. `false` otherwise.
   * 
   */
  async unlinkFromNumber(client, id){}

}

const api = new Api()

module.exports = api;
