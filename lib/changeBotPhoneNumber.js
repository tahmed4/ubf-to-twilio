const {TwilioRequestError} = require('../import-lib/Exceptions.js');
const Numbers = require("../import-lib/Numbers.js")

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
async function changeBotPhoneNumber(client, id, number) {
  try {
    var numbers = await Numbers.getNamesToNumber(client)
  } catch (e){
    throw new TwilioRequestError(e.message)
  }

  var phoneUid = ""


  try {
    phoneUid = await Numbers.getNumberId(client, number)
    await Numbers.updateNumberWebhook(client, id, phoneUid, false)
    if(numbers.hasOwnProperty(id)){
      if(numbers[id] !== number){
        phoneUid = await Numbers.getNumberId(client, numbers[id])
        await Numbers.updateNumberWebhook(client, id, phoneUid, true)
      }
    }

  } catch (e){
    throw new TwilioRequestError(e.message)
  }

  return true

}

module.exports =  {changeBotPhoneNumber}

