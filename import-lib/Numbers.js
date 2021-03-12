/**
 * Takes in phone number of format "+447123456789" and returns
 * it's corresponding id on Twilio servers.
 * 
 * @param {Object} client - Twilio API client object.
 * @param {string} number - The phone number which you want to retrieve the phone uid of.
 * 
 * @returns {string} - Twilio unique phone id of phone number
 */
async function getNumberId(client, number){
    var phoneUid = ""
    await client.incomingPhoneNumbers
    .list({phoneNumber: number})
    .then(incomingPhoneNumbers => incomingPhoneNumbers.forEach(i => phoneUid = i.sid));
    return phoneUid
}

/**
 * Sets the sms-url webhook for the specified twilio phone id and 
 * sets the friendly name of the phone number to the assistant id,
 * to represent which bot the number points to.
 * 
 * @param {Object} client - Twilio API client object.
 * @param {string} assistantUid - id of assistant you want to link to number.
 * @param {string} phoneUid - id of phone number you want assistant linked to.
 * @param {boolean} free - `true` to release phone number, `false` to set webhook at phone number
 * 
 */
async function updateNumberWebhook(client, assistantUid, phoneUid, free){
    var url = ""
    if (free){
        assistantUid = "free-number"
    } else{
        url = `https://channels.autopilot.twilio.com/v1/${client.accountSid}/${assistantUid}/twilio-messaging?TargetTask=greeting`
    }
    await client.incomingPhoneNumbers(phoneUid)
    .update({
        friendlyName: assistantUid,
        smsUrl: url
        })

}

/**
 * Returns all phone numbers that are associated
 * with the Twilio account.
 * 
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string[]} - all numbers associated with Twilio account.
 */
async function listNumbers(client){
    var numbers = []
    await client.incomingPhoneNumbers.list().then((incomingPhoneNumbers => incomingPhoneNumbers.forEach(i => numbers.push(i.phoneNumber))));
    return numbers
}

/**
 * Returns mapping of all friendly names of numbers associated
 * with the account with their respected number.
 * 
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Object} - mapping of friendly name to number
 */
async function getNamesToNumber(client){
    var numbers = {}
    await client.incomingPhoneNumbers.list().then((incomingPhoneNumbers => incomingPhoneNumbers.forEach(i => numbers[i.friendlyName] = i.phoneNumber)));
    return numbers
}

/**
 * Returns a list of the friendly names of each
 * phone number on the Twilio account.
 * 
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {Array.<string>}
 */
async function getLinkedAssistants(client){
    var linkedAssistants = []
    await client.incomingPhoneNumbers.list().then((incomingPhoneNumbers => incomingPhoneNumbers.forEach(i => linkedAssistants.push(i.friendlyName))));
    return linkedAssistants
}


module.exports =  {getNumberId, updateNumberWebhook, listNumbers, getNamesToNumber, getLinkedAssistants}