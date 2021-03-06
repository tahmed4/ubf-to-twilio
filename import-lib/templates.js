/**
 * Contains all templates for Twilio Tasks, predefined tasks (greeting,goodbye,collectfallback,fallback), stylesheet and collect handling script
 */

/**
 * Speak Task Template
 */
function getChainedSpeak(){
    return {"actions": [{"say": ""}, {"redirect": "task://"}]}
}

/**
 * Yes/No Question Task Template
 */
function getYNTemplate(){
    return {"actions": [{"collect": {"name": "collect_response", "questions": [{"question": "", "name": "", "type": "Twilio.YES_NO"}], "on_complete": {"redirect": {"method": "POST", "uri": ""}}}}]}
}

/**
 * Last Task before termination Template
 */
function getFinalTask(){
    return {"actions": [{"say": ""}]}
}

/**
 * Greeting Task template
 */
function getGreeting(){
    return {"actions" : { "actions" : [{ "redirect" : "task://" }] }}   
}

/**
 * Goodbye Task template
 */
function getGoodbye(){
    return {"actions":[{"say":"Thank you! Please reach out again if you need anything. Goodbye."}]}
}

/**
 * Collect Fallback task template
 */
function getCollectFallback(){
    return {"actions":[{"say":"Looks like I'm having trouble. Apologies for that. Let's start again, how can I help you today?"},{"listen":true}]}
}

/**
 * Fallback task template
 */
function getFallback(){
    return {"actions":[{"say":"I'm sorry didn't quite get that. Please say that again."},{"listen":true}]}
}

/**
 * Assistant Stylesheet template
 */
function getStyleSheet(){
    return {"style_sheet":{"voice":{"say_voice":"Polly.Matthew"},"name":"","collect":{"validate":{"on_failure":{"messages":[{"say":{"speech":"I didn't get that. What did you say?"}},{"say":{"speech":"I still didn't catch that. Please repeat."}},{"say":{"speech":"Let's try one last time. Say it again please."}}],"repeat_question":false},"on_success":{"say":{"speech":""}},"max_attempts":4}}}}
}

/**
 * Handler script to be uploaded to Twilio Function.
 */
function getCollect(){
    return `const fs = require('fs');
    exports.handler = function(context, event, callback) {
        let responseItem = {};
        let fileName = '/mapping.json';
        let file = Runtime.getAssets()[fileName].path;
        let text = fs.readFileSync(file);
        let memory = JSON.parse(event.Memory);
        var mapping = JSON.parse(text);
    
        let answersObj = memory.twilio.collected_data.collect_response.answers;
        var questionNo;
        questionNo = Object.keys(answersObj).reverse()[0];
        var answerString = "twilio.collected_data.collect_response.answers."+questionNo+".answer";
    
        function index(obj,i) {return obj[i]}
        let userInput = answerString.split('.').reduce(index, memory);
        
        let actions = [];
        console.log(memory.twilio.collected_data);
        
    
        if(userInput == "Yes" && mapping[questionNo].length == 2){
            questionNo = mapping[questionNo][0]
            responseItem = {
                "redirect": {
                    "method": "POST",
                    "uri": "task://"+ questionNo
                }
            };
            actions.push(responseItem);
        }
        
        else if (userInput == "No" && mapping[questionNo].length == 2) {
            questionNo = mapping[questionNo][1]
            responseItem = {
                "redirect": {
                    "method": "POST",
                    "uri": "task://" + questionNo
                }
            };
            actions.push(responseItem);
        }
        
        else{
            questionNo = mapping[questionNo][0]
            responseItem = {
                "redirect": {
                    "method": "POST",
                    "uri": "task://"+ questionNo
                }
            };
            actions.push(responseItem);
        }
        
        let respObj = {
            "actions": actions
        };
    
        
        callback(null, respObj);
    };`
}


module.exports = {getChainedSpeak, getCollect, getCollectFallback, getFallback, getFinalTask, getGoodbye, getGreeting, getStyleSheet, getYNTemplate}
