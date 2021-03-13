async function getAssistants(client){
    if(client.authKey != "valid"){
        return {
            allBots: [],
            assistants: []
        }
    }
    var bots = [{"phoneNumber": null, "name": "test-1", "id": "test-1", "diagram": null, "timestamp": "1"}, {"phoneNumber": null, "name": "test-2", "id": "test-2", "diagram": null, "timestamp": "1"} ,{"phoneNumber": null, "name": "test-3", "id": "test-3", "diagram": null, "timestamp": "1"}]
    var allAssistants = ["test-1", "test-2", "test-3"]
    return {
        allBots: bots,
        assistants: allAssistants
    }
}



module.exports = {getAssistants}