const {TwilioRequestError} = require('../import-lib/Exceptions.js');
const Numbers = require("../import-lib/Numbers.js")

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
async function unlinkFromPhoneNumber(client, id) {
  var phoneUid = ""

  try {
    botNumbers = await Numbers.getNamesToNumber(client)
    
    if(id in botNumbers){
      phoneUid = await Numbers.getNumberId(client, botNumbers[id])
      await Numbers.updateNumberWebhook(client, id, phoneUid, true)
    } else{
      return false
    }

  } catch (e){
    throw new TwilioRequestError(e.message)
  }

  return true

}

module.exports =  {unlinkFromPhoneNumber}

