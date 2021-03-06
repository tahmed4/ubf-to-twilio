/**
 * Creates a service on Twilio.
 * 
 * @param {string} name - Name you want to give to service.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - service id of newly created service
 */
async function createService(name, client){
    var service_id = ""
    await client.serverless.services
                .create({
                    includeCredentials: true,
                    uniqueName: name,
                    friendlyName: name
                })
                .then(service => service_id = service.sid);

    return service_id
}

/**
 * Creating an assistant environment in Twilio.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - Twilio environment id
 */
async function createEnvironment(serviceUid, client){
    var environmentId = ""
    await client.serverless.services(serviceUid)
    .environments
    .create({domainSuffix: 'dev', uniqueName: 'development'})
    .then(environment => environmentId = environment.sid);
    return environmentId
    
}


/**
 * Generate build for uploaded bot.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {string} functionVersionUid - Twilio function version id.
 * @param {string} assetVersionUid - Twilio asset version id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - Twilio build id.
 */
async function createBuild(serviceUid, functionVersionUid, assetVersionUid, client){
    var buildUid = ""
    await client.serverless.services(serviceUid)
                 .builds
                 .create({
                     functionVersions: functionVersionUid,
                     assetVersions: assetVersionUid
                 })
                 .then(build => buildUid = build.sid);
    return buildUid
}

/**
 * Returns the current status of given build
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {string} buildUid - Twilio build id.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string} - Status of build e.g ("complete")
 */
async function getBuildStatus(serviceUid, buildUid, client){
    var status = ""
    await client.serverless.services(serviceUid)
    .builds(buildUid)
    .buildStatus()
    .fetch()
    .then(build_status => status = build_status.status);
    return status
}

/**
 * Deploys Twilio assistant.
 * 
 * @param {string} serviceUid - Twilio service id.
 * @param {string} environmentUid - Twilio environment id.
 * @param {string} buildUid - Twilio build id.
 * @param {client} client - Twilio API client object.
 */
async function createDeployment(serviceUid, environmentUid, buildUid, client){
    await client.serverless.services(serviceUid)
                 .environments(environmentUid)
                 .deployments
                 .create({
                     buildSid: buildUid
                 })
}

/**
 * This takes in an assistant id and looks through all live Twilio
 * services and returns the service id if a match is found.
 * 
 * @param {string} assistantName - Name of assistant find linked service.
 * @param {Object} client - Twilio API client object.
 * 
 * @returns {string}
 */
async function getServiceUid(assistantName, client){
    var serviceUid = ""
    await client.serverless.services
                .list()
                .then(services => services.forEach(s => {
                    if(s.friendlyName ===  assistantName){
                        serviceUid = s.sid
                    }
                }));
    return serviceUid
}

/**
 * Removes a live service from Twilio services
 * via service id.
 * 
 * @param {string} serviceUid - The Twilio service id of the service you want to delete
 * @param {Object} client - Twilio API client object.
 */
async function deleteService(serviceUid, client){
    await client.serverless.services(serviceUid).remove();
}

module.exports = {createService, createEnvironment, createBuild, getBuildStatus, createDeployment, getServiceUid, deleteService}