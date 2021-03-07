const templates = require("./templates.js")
var FD = require('form-data');
const { default: axios } = require('axios');

/**
 * Retrieve function version of twilio function.
 * 
 * @param {string} serviceUid - Twilio service id
 * @param {string} functionUid - Twilio function id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - Twilio function version id
 */
async function getFunctionVersion(serviceUid, functionUid, client){
    var functionVersionUid = ""
    await client.serverless.services(serviceUid)
        .functions(functionUid)
        .functionVersions
        .list()
        .then(assetVersions => assetVersions.forEach(a => functionVersionUid = a.sid));
    return functionVersionUid
}

/**
 * Create specific function for Twilio service.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - function id of newly created Twilio function
 */
async function createFunction(serviceUid, client){
    var functionUid = ""
    await client.serverless.services(serviceUid)
                    .functions
                    .create({friendlyName: '/collect'})
                    .then(function_ => functionUid = function_.sid);
    return functionUid
}

  /**
   * Sends request to upload collect.js handler file
   * 
   * @param {string} serviceUid - Twilio service id.
   * @param {string} functionUid - Twilio function id for file to be upload to.
   * @param {Object} client - Twilio API client object.
   */
async function createFunctionResource(serviceUid, functionUid, client){
    let collect_file = await templates.getCollect()

    let url = `https://serverless-upload.twilio.com/v1/Services/${serviceUid}/Functions/${functionUid}/Versions`

    let form = new FD();

    form.append("Path", "collect");
    form.append("Visibility", "public");
    form.append("Content", collect_file, "collect.js");
    form.append("contentType", "application/javascript");

    await axios.post(url, form,  {
    headers: {
        Authorization: 'Basic ' + Buffer.from(`${client.accountSid}:${client.password}`).toString('base64'),
        ...form.getHeaders(),
    },
    })

}

/**
 * Find the uri for a given Twilio service.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - uri of service.
 */
async function fetchFunctionUri(serviceUid, client){
    var domain = ""
    await client.serverless.services(serviceUid)
    .environments
    .list()
    .then(environments => environments.forEach(e =>{
        domain = e.domainName
    }))
    return domain
}

module.exports = {getFunctionVersion, createFunction, createFunctionResource, fetchFunctionUri}