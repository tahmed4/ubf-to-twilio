const schemas = require("./schemas.js")
const log = require("log");
const validate  = require('jsonschema').validate;



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
 * Performs validation on input diagram checking if types
 * and nodes are supported.
 * 
 * @param {Object} diagram - voiceflow diagram
 * 
 * @returns {boolean} - `true` if passes validation, otherwise `false`
 */
async function validateDiagram(diagram){
    var supportedBlocks = ["speak", "block", "interaction", "start", "command"]
    var startFound = false

    try{
        var rootDiagram = diagram["version"]["rootDiagramID"]
    } catch(err) {
        log.error("invalid vf file: root diagram missing")
        log.error(err)
        return false
    }
    try {
        var nodes = diagram["diagrams"][rootDiagram]["nodes"]
    } catch(err) {
        log.error("invalid vf file: nodes missing")
        log.error(err)
        return false
    }

    try {
        for(var node in nodes){
            if(!(supportedBlocks.includes(nodes[node]["type"]))){
                log.error(`invalid vf file: unsupported block ${nodes[node]["type"]}`)
                return false
            }

            if(nodes[node]["type"] === "interaction"){
                try{
                if(nodes[node]["data"]["ports"].length > 3){
                    log.error(`invalid vf file: more than just a Yes/No question at node ${node}`)
                    return false
                } else if (nodes[node]["data"]["ports"].length < 3){
                    log.error(`invalid vf file: incomplete choice block at ${node}`)
                    return false
                }

                } catch (e) {
                    log.error(`invalid vf file: missing ports on node ${node}`)
                    log.error(e)
                    return false
                }
            }
            
            if(nodes[node]["type"] === "start"){
                startFound = true
            }
        }    

    } catch (err) {
        log.error(err)
        return false
    }

    if (!startFound){
        log.error("start block missing")
        return false
    }

    return true
}

/**
 * Checks if name meets Twilio's format.
 * 
 * @param {string} name - name you want to check.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {boolean} - `true` if meets format, otherwise `false`.
 */
async function checkNameFormat(name, client){
    async function createService(name, client){
        var serviceId = ""
        await client.serverless.services
                    .create({
                        includeCredentials: true,
                        uniqueName: name,
                        friendlyName: name
                    })
                    .then(service => serviceId = service.sid);

        return serviceId
    
    }

    async function deleteService(serviceUid, client){
        await client.serverless.services(serviceUid).remove();
    }

    try{
        var serviceUid = await createService(name,client)
        await deleteService(serviceUid, client)

    } catch (e) {
        log.error(e)
        return false
    }
    return true

}

/**
 * Checks against JSON schemas for voiceflow diagram
 * as well as individual nodes to see if diagram is valid.
 * 
 * @param {*} diagram - voiceflow diagram
 * 
 * @returns {boolean} - `true` if diagram is valid, otherwise `false`.
 */
async function validateDiagramWithSchema(diagram){
    let vfSchema = await schemas.getVFSchema();
    vfSchema = JSON.parse(vfSchema)
    var res = validate(diagram, vfSchema);
    if(res.valid === false){
        log.error("invalid vf file")
        return false
    }
    
    var nodeSchemas = []
    nodeSchemas.push(await schemas.getSpeakSchema())
    nodeSchemas.push(await schemas.getChoiceSchema())
    nodeSchemas.push(await schemas.getBlockSchema())
    nodeSchemas.push(await schemas.getCommandSchema())
    nodeSchemas.push(await schemas.getStartSchema())
    
    let root_diagram = diagram["version"]["rootDiagramID"]
    var nodes = diagram["diagrams"][root_diagram]["nodes"]

    for(var node in nodes){
        var nodeValid = false
        for(var i in nodeSchemas){
            nodeValid = validate(nodes[node], JSON.parse(nodeSchemas[i])).valid
            if(nodeValid === true){
                break
            }
        }
        if(nodeValid === false){
            log.error(`invalid node ${node}`)
            return false
        }
    }
    return true
}

module.exports = {serviceNameAvaialble, assistantNameAvailable, validateDiagram, checkNameFormat, validateDiagramWithSchema}
