var FD = require('form-data');
const { default: axios } = require('axios');

/**
 * Creates an asset at a given service.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - Twilio asset id
 */
async function createAsset(serviceUid, client){
    var assetUid = ""
    await client.serverless.services(serviceUid)
                    .assets
                    .create({friendlyName: '/mapping'})
                    .then(asset => assetUid = asset.sid);
    return assetUid
}

/**
 * Sends request to upload mapping of tasks.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {string} assetUid - Twilio asset id.
 * @param {Object} mapping - Mapping between tasks.
 * @param {Object} client - Twilio API client object.
 */
async function createAssetResource(serviceUid, assetUid, mapping, client){
    let url = `https://serverless-upload.twilio.com/v1/Services/${serviceUid}/Assets/${assetUid}/Versions`


    let form = new FD();
    form.append("Path", "mapping.json");
    form.append("Visibility", "private");
    form.append("Content", JSON.stringify(mapping), "mapping.json");
    form.append("contentType", "application/json");

    await axios.post(url, form,  {
    headers: {
        Authorization: 'Basic ' + Buffer.from(`${client.accountSid}:${client.password}`).toString('base64'),
        ...form.getHeaders(),
    },
    })
}

/**
 * Retrieve asset version of asset.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {string} assetUid - Twilio asset id.
 * @param {Object} client  - Twilio API client object.
 * 
 * @returns {string} - Twilio asset version id
 */
async function getAssetVersion(serviceUid, assetUid, client){
    var assetVersionUid = ""
    await client.serverless.services(serviceUid)
        .assets(assetUid)
        .assetVersions
        .list()
        .then(assetVersions => assetVersions.forEach(a => assetVersionUid = a.sid));
    return assetVersionUid
}

module.exports = {createAsset, createAssetResource, getAssetVersion}