const log = require("log");
const request = require('request-promise');

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
async function simulateBot(client, id, text){
    /**
     * Sends a request to twilio to simulate a bots reaction
     * to a given text message.
     * 
     * @param {Object} client - Twilio API client object.
     * @param {string} id  - id of assistant which you want to simulate.
     * @param {string} text - text message which you want to send to the bot.
     * 
     * @returns {Object} - response object from request to Twilio
     */
    async function sendRequest(client, id, text){
        let channel = "apichannel"
        let userpass = `${client.accountSid}:${client.password}`
        let options = {
            method : "POST",
            uri : `https://channels.autopilot.twilio.com/v2/${client.accountSid}/${id}/custom/${channel}`,
            headers : {
                authorization : `Basic ${Buffer.from(userpass).toString('base64')}`
            },
            form : {
                Text : text,
                UserId : client.accountSid,
                Language : 'en-US'
            },
            json : true
        }
        
        return request(options).then(resp => {return resp})
    }
    
    log.info(`simulating ${id}, ${text}`)
    let texts = []
    try {
        let response = await sendRequest(client, id, text)
        for(var i in response.response.says){
            if (response.response.says[i].text !== ''){
                texts.push(response.response.says[i].text)
            }
        }
    } catch (e){
        log.error(e)
        return null

    }
    return texts
}




module.exports = {simulateBot}


