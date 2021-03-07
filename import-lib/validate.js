const vfSchemas = require("./vf-schemas.js")
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
 * Performs validation on input diagram checking if types
 * and nodes are supported.
 * 
 * @param {Object} diagram - voiceflow diagram
 * 
 * @returns {boolean} - `true` if passes validation.
 * 
 * @throws {ValidationError} - Thrown if validation fails.
 */
async function validateDiagram(diagram){
    var supportedBlocks = ["speak", "block", "interaction", "start", "command"]
    var startFound = false

    try{
        var rootDiagram = diagram["version"]["rootDiagramID"]
    } catch(err) {
        message = "invalid vf file: root diagram missing\n" + err 
        throw new ValidationError(message)
    }
    try {
        var nodes = diagram["diagrams"][rootDiagram]["nodes"]
    } catch(err) {
        message = "invalid vf file: nodes missing\n" + err
        throw new ValidationError(message)
    }

    try {
        for(var node in nodes){
            if(!(supportedBlocks.includes(nodes[node]["type"]))){
                throw new ValidationError(`invalid vf file: unsupported block ${nodes[node]["type"]}`)
            }

            if(nodes[node]["type"] === "interaction"){
                try{
                if(nodes[node]["data"]["ports"].length > 3){
                    throw new ValidationError(`invalid vf file: more than just a Yes/No question at node ${node}`)
                } else if (nodes[node]["data"]["ports"].length < 3){
                    throw new ValidationError(`invalid vf file: incomplete choice block at ${node}`)
                }

                } catch (e) {
                    message = `invalid vf file: missing ports on node ${node}\n` + e
                    throw new ValidationError(message)
                }
            }
            
            if(nodes[node]["type"] === "start"){
                startFound = true
            }
        }    

    } catch (err) {
        throw new ValidationError(err)
    }

    if (!startFound){
        throw new ValidationError("Start block missing")
    }

    return true
}

/**
 * Checks if name meets Twilio's format.
 * 
 * @param {string} name - name you want to check.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {boolean} - `true` if meets format.
 * 
 * @throws {ValidationError} - if format is not met.
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
        throw new ValidationError(e)
    }
    return true

}

/**
 * Checks against JSON schemas for voiceflow diagram
 * as well as individual nodes to see if diagram is valid.
 * 
 * @param {Object} diagram - voiceflow diagram
 * 
 * @returns {boolean} - `true` if diagram is valid.
 * 
 * @throws {ValidationError} - throws if diagram is invalid.
 */
async function validateDiagramWithSchema(diagram){
    let vfSchema = await vfSchemas.getVFSchema();
    vfSchema = JSON.parse(vfSchema)
    var res = validate(diagram, vfSchema);
    if(res.valid === false){
        throw new ValidationError("invalid vf file")
    }
    
    var nodeSchemas = []
    nodeSchemas.push(await vfSchemas.getSpeakSchema())
    nodeSchemas.push(await vfSchemas.getChoiceSchema())
    nodeSchemas.push(await vfSchemas.getBlockSchema())
    nodeSchemas.push(await vfSchemas.getCommandSchema())
    nodeSchemas.push(await vfSchemas.getStartSchema())
    
    let root_diagram = diagram["version"]["rootDiagramID"]
    var nodes = diagram["diagrams"][root_diagram]["nodes"]

    valid = await checkNodesWithSchemas(nodes, nodeSchemas)
    return true
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
    
    var nodeSchemas = []
    nodeSchemas.push(await ubfSchemas.getUBFChoiceSchema())
    nodeSchemas.push(await ubfSchemas.getUBFSpeakSchema())
    nodeSchemas.push(await ubfSchemas.getUBFStartSchema())

    var nodes = diagram["project"]["nodes"]

    valid = await checkNodesWithSchemas(nodes, nodeSchemas)
    return true
}

/**
 * Utility function that iterates through all nodes
 * in a diagram and validates against their own
 * node schemas.
 * 
 * @param {Object} nodes - Nodes of input diagram.
 * @param {Object} nodeSchemas - Schemas for each type of node.
 * 
 * @returns {boolean} - `true` if all nodes are valid.
 * 
 * @throws {ValidationError} - throws if diagram is invalid.
 */
async function checkNodesWithSchemas(nodes, nodeSchemas){
    for(var node in nodes){
        var nodeValid = false
        for(var i in nodeSchemas){
            nodeValid = validate(nodes[node], JSON.parse(nodeSchemas[i])).valid
            if(nodeValid === true){
                break
            }
        }
        if(nodeValid === false){
            throw new ValidationError(`invalid node ${node}`)
        }
    } 
    return true 
}

module.exports = {serviceNameAvaialble, assistantNameAvailable, validateDiagram, checkNameFormat, validateDiagramWithSchema, validateUBF}
