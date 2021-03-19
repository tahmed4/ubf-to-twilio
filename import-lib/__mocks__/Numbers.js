const {TwilioRequestError} = require('../Exceptions.js');

async function listNumbers(client){
    if(typeof client != "object" || client == null){
        return []
    }
    var numbers = ["+447958293912", "+447942960231", "+447284920342"]
    if(client.authKey != "valid"){
        return []
    } 
    return numbers
}


async function getNamesToNumber(client){
    if(typeof client != "object" || client == null){
        return []
    }
    var numbers = {}
    numbers["test-1"] = "+447958293912"
    numbers["test-2"] = "+447942960231"
    if(client.authKey != "valid"){
        return {}
    }
    return numbers
}


async function getLinkedAssistants(client){
    if(typeof client != "object" || client == null){
        return []
    }
    var linkedAssistants = ["test-1", "test-2"]
    if(client.authKey != "valid"){
        return []
    }
    return linkedAssistants
}


async function getNumberId(){
    return "id"
}

async function updateNumberWebhook(client, assistantUid, phoneUid, free){
    if(typeof client != "object" || client == null){
        return new TwilioRequestError()
    }
    if(client.authKey != "valid"){
        return new TwilioRequestError()
    }

    return true
    

}


module.exports =  {listNumbers, getNamesToNumber, getLinkedAssistants, getNumberId, updateNumberWebhook}