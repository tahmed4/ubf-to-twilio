const templates = require("./templates.js")
const log = require("log");


/**
 * Go through each node and return the speak 
 * node connected to start.
 * 
 * @param {Object} nodes - All nodes from unified bot format.
 * 
 * @returns {string} - Node id of first speak node.
 */
function getStartNode(nodes){
     for (var nodeID in nodes){
        var node = nodes[nodeID]
        if(node["type"] === "start"){
            return node["next"]
        }
    }
}

/**
 * Look at next connection and identify what type of template is 
 * to be used for current node.
 * 
 * @param {string} node - Current node.
 * @param {Object} allNodes - All nodes from bot format.
 * 
 * @returns {string} = Template type.
 */
async function findNodeTemplateType(node, allNodes){
    var nodeInfo = allNodes[node]

    
    if(nodeInfo["type"] === "speak"){
        //speak[target] = None
        if(nodeInfo["next"] === null){
            return "finalTask"
        }

        var nextNode = nodeInfo["next"]
        var nextNodeInfo = allNodes[nextNode]
        
        //speak -> speak -> speak

        if(nextNodeInfo["type"] === "speak"){
            return "chainedSpeak"
        }

        //speak -> interaction 
        if(nextNodeInfo["type"] === "interaction"){
            return "YNTemplate"
        }
        else {
            throw new Error("unsupported voiceflow diagram. \n Ensure that you only use \"speak\" and \"interaction\" blocks ") 
        }
    }
}


/**
 * Load the JSON templates for each task.
 * 
 * @param {string} templateType - Describes which template to be loaded.
 * 
 * @returns {Object} - Template
 */
async function loadTemplate(templateType){
    
    if(templateType === "YNTemplate"){
        return await templates.getYNTemplate()
    } else if (templateType === "finalTask"){
        return await templates.getFinalTask()
    } else if (templateType === "chainedSpeak"){
        return await templates.getChainedSpeak()
    }

}

/**
 * Generates the Twilio Tasks from templates   
 *  
 * @param {string} node - Node to generate task of.
 * @param {Object} allNodes - All nodes from bot format.
 * @param {string} startNode - The start node.
 * @param {Object} mapping - Mapping from one node to another.
 * 
 * @returns {Object} - Template and associated node.
 */
async function generateJSON(node, allNodes, startNode, mapping){
    var peekVal = await findNodeTemplateType(node, allNodes)
    var template = await loadTemplate(peekVal)
    
    var nodeInfo = allNodes[node]
    var text = nodeInfo["content"]
    
    if(peekVal === "YNTemplate"){
        template["actions"][0]["collect"]["questions"][0]["question"] = text
        template["actions"][0]["collect"]["questions"][0]["name"] = node
        template["actions"][0]["collect"]["on_complete"]["redirect"]["uri"] = "bot_uri_holder"
        
    }

    else if(peekVal === "finalTask"){
        template["actions"][0]["say"] = text
    }
    
    else if(peekVal === "chainedSpeak"){
        template["actions"][0]["say"] = text
        template["actions"][1]["redirect"] += mapping[node]
    }
    
    if(node === startNode){
        node = "start" + node
    }

    return{
        node : node,
        template: template,
    }
}


/**
 * Using the bot format, goes through each node
 * and builds the tasks and mapping.
 * 
 * @param {Object} diagram - Voiceflow diagram.
 * 
 * @returns {Object} - Tasks and mapping.
 */
async function genTasksAndMapping(diagram){
    try {
        var tasks = {}
        var mapping = {}
        var nodes = diagram["project"]["nodes"]
        var startNode = await getStartNode(nodes);

        for(var node in nodes){
            var nodeInfo = nodes[node]
            if(nodeInfo["type"] === "speak"){
                if(nodeInfo["next"] != null){
                    var nextNodeInfo = nodes[nodeInfo["next"]]
                    if(nextNodeInfo["type"] === "speak"){
                        mapping[node] = nodeInfo["next"]
                    } else if(nextNodeInfo["type"] === "interaction"){
                        mapping[node] = [nextNodeInfo["options"][0]["next"], nextNodeInfo["options"][1]["next"]]
                    }
                    
                }
                let taskDef = await generateJSON(node, nodes, startNode, mapping)
                tasks[taskDef.node] = taskDef.template
            }
        }
    } catch (e){
        log.error(e)
        return null
    }
    return {
        tasks: tasks,
        mapping: mapping
    }
}

/**
 * Initiate task generation.
 * 
 * @param {Object} diagram - Voiceflow diagram.
 * 
 * @returns {Object} - Tasks and mapping.
 */
async function generateTasks(diagram){
    let generated = await genTasksAndMapping(diagram)
    return generated
}

module.exports = {generateTasks}