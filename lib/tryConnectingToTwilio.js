const log = require("log");
const twilio = require('twilio');

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
async function twilioConnect(twilioAccountSid, twilioAuthToken) {
  log.info(`Connecting to Twilio`)
  async function getAccount(client){
    var valid = true
    try {
      await client.api.accounts.list()
    } catch (e) {
      log.error(e)
      valid = false
    }

    return valid
  }

  try{
    var client = twilio(twilioAccountSid, twilioAuthToken);
  } catch (e){
    log.error(e)
    return false
  }

  var valid = await getAccount(client)

  if(valid && client._httpClient.lastResponse.statusCode === 200){
    return client
  } else{
    return null
  }
  

  }

module.exports = {twilioConnect};
