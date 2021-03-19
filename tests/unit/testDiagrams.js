
function getValid(){
    return `{
        "project":{
           "nodes":{
              "5f9f562f11b31520c2a2a6de":{
                 "type":"start",
                 "next":"6047b8ab9bdc55674868041e"
              },
              "6047b78c9bdc556748680285":{
                 "type":"interaction",
                 "options":[
                    {
                       "type":"yes",
                       "next":"6047b7ac9bdc556748680293"
                    },
                    {
                       "type":"no",
                       "next":"6047b7ae9bdc55674868029d"
                    }
                 ]
              },
              "6047b7ac9bdc556748680293":{
                 "type":"speak",
                 "content":"Yes",
                 "next":null
              },
              "6047b7ae9bdc55674868029d":{
                 "type":"speak",
                 "content":"No",
                 "next":null
              },
              "6047b8ab9bdc55674868041b":{
                 "type":"speak",
                 "content":"Hello",
                 "next":"6047b78c9bdc556748680285"
              }
           },
           "name":"test"
        }
     }`

}

function getValidResp(){
    return `{
        "mapping": {
          "6047b8ab9bdc55674868041b": [
            "6047b7ac9bdc556748680293",
            "6047b7ae9bdc55674868029d"
          ]
        },
        "tasks": {
          "6047b7ac9bdc556748680293": {
            "actions": [
              {
                "say": "Yes"
              }
            ]
          },
          "6047b7ae9bdc55674868029d": {
            "actions": [
              {
                "say": "No"
              }
            ]
          },
          "6047b8ab9bdc55674868041b": {
            "actions": [
              {
                "collect": {
                  "name": "collect_response",
                  "on_complete": {
                    "redirect": {
                      "method": "POST",
                      "uri": "bot_uri_holder"
                    }
                  },
                  "questions": [
                    {
                      "name": "6047b8ab9bdc55674868041b",
                      "question": "Hello",
                      "type": "Twilio.YES_NO"
                    }
                  ]
                }
              }
            ]
          }
        }
      }`
}

function getExtraKey(){
    return `{
        "extra" : "key",
        "project":{
           "nodes":{
              "5f9f562f11b31520c2a2a6de":{
                 "type":"start",
                 "next":"6047b8ab9bdc55674868041e"
              },
              "6047b78c9bdc556748680285":{
                 "type":"interaction",
                 "options":[
                    {
                       "type":"yes",
                       "next":"6047b7ac9bdc556748680293"
                    },
                    {
                       "type":"no",
                       "next":"6047b7ae9bdc55674868029d"
                    }
                 ]
              },
              "6047b7ac9bdc556748680293":{
                 "type":"speak",
                 "content":"Yes",
                 "next":null
              },
              "6047b7ae9bdc55674868029d":{
                 "type":"speak",
                 "content":"No",
                 "next":null
              },
              "6047b8ab9bdc55674868041b":{
                 "type":"speak",
                 "content":"Hello",
                 "next":"6047b78c9bdc556748680285"
              }
           },
           "name":"test"
        }
     }`

}

function getMissingName(){
    return `{
        "project":{
           "nodes":{
              "5f9f562f11b31520c2a2a6de":{
                 "type":"start",
                 "next":"6047b8ab9bdc55674868041e"
              },
              "6047b78c9bdc556748680285":{
                 "type":"interaction",
                 "options":[
                    {
                       "type":"yes",
                       "next":"6047b7ac9bdc556748680293"
                    },
                    {
                       "type":"no",
                       "next":"6047b7ae9bdc55674868029d"
                    }
                 ]
              },
              "6047b7ac9bdc556748680293":{
                 "type":"speak",
                 "content":"Yes",
                 "next":null
              },
              "6047b7ae9bdc55674868029d":{
                 "type":"speak",
                 "content":"No",
                 "next":null
              },
              "6047b8ab9bdc55674868041b":{
                 "type":"speak",
                 "content":"Hello",
                 "next":"6047b78c9bdc556748680285"
              }
           }
        }
     }`

}


function getMissingNodes(){
    return `{
        "project":{
           "name":"test"
        }
     }`

}

module.exports = {getValid, getValidResp, getExtraKey, getMissingName, getMissingNodes}