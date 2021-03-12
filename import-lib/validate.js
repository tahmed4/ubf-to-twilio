const ubfSchemas = require("./ubf-schemas.js")
const validate  = require('jsonschema').validate;
const {ValidationError} = require('./Exceptions.js');


/**
 * Checks if name provided already exists on twilio service.
 * 
 * @param {Object} client - Twilio API client object.
 * @param {string} name - name of bot.
 * 
 * @returns {boolean} - `true` if already exists, `false` otherwise
 */
async function serviceNameAvaialble(client, name){
    var serviceNameFree = true
    await client.serverless.services
                 .list()
                 .then(services => services.forEach(s => {
                     if(s.friendlyName ===  name){
                        serviceNameFree = false
                     }
                 }));
    return serviceNameFree

}

/**
 * Checks if name provided already exists as a Twilio assistant.
 * 
 * @param {Object} client - Twilio API client object.
 * @param {string} name - name of bot.
 * 
 * @returns {boolean} - `true` if already exists, `false` otherwise
 */
async function assistantNameAvailable(client, name){
    var assistantNameFree = true
    await client.autopilot.assistants
        .list()
        .then(assistants => assistants.forEach(a => { 
            if(a.uniqueName ===  name){
                assistantNameFree = false
             }
        }));
    
    return assistantNameFree

}

/**
 * Checks against JSON schemas for universal bot format
 * as well as individual nodes to see if input diagram is valid.
 * 
 * @param {Object} diagram - UBF diagram
 * 
 * @returns {boolean} - `true` if diagram is valid.
 * 
 * @throws {ValidationError} - throws if diagram is invalid.
 */
 async function validateUBF(diagram){
    let ubfSchema = await ubfSchemas.getUBFSchema();
    ubfSchema = JSON.parse(ubfSchema)
    var res = validate(diagram, ubfSchema);
    if(res.valid === false){
        throw new ValidationError("invalid ubf diagram")
    }
    
    var nodeSchemas = {}
    nodeSchemas["interaction"] = await ubfSchemas.getUBFChoiceSchema()
    nodeSchemas["speak"] = await ubfSchemas.getUBFSpeakSchema()
    nodeSchemas["start"] = await ubfSchemas.getUBFStartSchema()

    var nodes = diagram["project"]["nodes"]
    for(var node in nodes){
        var nodeValid = false

        nodeValid = validate(nodes[node], JSON.parse(nodeSchemas[nodes[node]["type"]])).valid
        
        if(nodeValid === false){
            return false
        }
    }
    return true
}

module.exports = {serviceNameAvaialble, assistantNameAvailable, validateUBF}


