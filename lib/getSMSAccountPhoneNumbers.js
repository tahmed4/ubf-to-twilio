const log = require("log");
const Numbers = require("../import-lib/Numbers.js")


/**
 * Returns all phone numbers under this account's control
 * including numbers that are currently in use by bots
 * or available.
 * 
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string[]} - all phonenumbers on twilio Account. `null` on error
 */
async function getSMSAccountPhoneNumbers(client) {
  try{
  var resp = await Numbers.listNumbers(client)
  return resp
  } catch (e){
  log.error(e)
  return null
  }

}

module.exports = {getSMSAccountPhoneNumbers};
