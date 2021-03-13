
async function listNumbers(client){
    var numbers = ["+447958293912", "+447942960231", "+447284920342"]
    if(client.authKey != "valid"){
        return []
    }
    return numbers
}


async function getNamesToNumber(client){
    var numbers = {}
    numbers["test-1"] = "+447958293912"
    numbers["test-2"] = "+447942960231"
    if(client.authKey != "valid"){
        return {}
    }
    return numbers
}


async function getLinkedAssistants(client){
    var linkedAssistants = ["test-1", "test-2"]
    if(client.authKey != "valid"){
        return []
    }
    return linkedAssistants
}


module.exports =  {listNumbers, getNamesToNumber, getLinkedAssistants}