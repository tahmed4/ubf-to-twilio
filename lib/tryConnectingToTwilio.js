const {TwilioRequestError} = require('../import-lib/Exceptions.js');
const twilio = require("twilio")

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
 * @throws {TwilioRequestError} - If twilio request to fetch client fails.
 * 
 * @throws {Error} - If login fails.
 */
async function twilioConnect(twilioAccountSid, twilioAuthToken) {
  async function getAccount(client){
    var valid = true
    try {
      await client.api.accounts.list()
    } catch (e) {
      valid = false
    }

    return valid
  }

  try{
    var client = twilio(twilioAccountSid, twilioAuthToken);
  } catch (e){
    throw new TwilioRequestError(e.message)
  }
  
  var valid = await getAccount(client)
  if(valid && client._httpClient.lastResponse.statusCode === 200){
    return client
  } else{
    throw new Error("Invalid Twilio Credentials")
  }
  

}

module.exports = {twilioConnect};
