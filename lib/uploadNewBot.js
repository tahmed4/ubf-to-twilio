const taskGen = require("../import-lib/generateTasks.js")
const validate = require("../import-lib/validate.js")
const templates = require("../import-lib/templates.js")
const Samples = require("../import-lib/Samples.js")
const Assets = require("../import-lib/Assets.js")
const Functions = require("../import-lib/Functions.js")
const Services = require("../import-lib/Services.js")
const Assistants = require("../import-lib/Assistants.js")
const {ValidationError, TwilioRequestError} = require('../import-lib/Exceptions.js');

/**
 * Creates a service and assistant using provided bot.name and
 * breaks down bot.diagram into Twilio tasks and uploads them
 * alongside mapping and handling files to Twilio.
 * 
 * 
 * @param {Object} client -  Twilio API client object.
 * @param {Object} bot - Defined bot that is about to be uploaded.
 * 
 * @returns {string} - Twilio assistant unique id. 
 * 
 * @throws {ValidationError} - If bot definition is missing any data.
 */
async function uploadNewBot(client, bot) {

  /**
   * Creates task and uploads the task to given assistant
   * 
   * @param {string} name - name of task.
   * @param {Object} task - json definition of Twilio task.
   * @param {string} assistantUid - Twilio assistant id.
   * @param {Object} client - Twilio API client object.
   */
  async function createTask(name, task, assistantUid, client){
      var task_actions = task["actions"]
      var taskSid =  ""
      await client.autopilot.assistants(assistantUid)
    .tasks
    .create({friendlyName: name, actions: {
       actions: task_actions
     }, uniqueName: name})
    .then(task => {
        if (name === "greeting"){
          taskSid = task.sid
      }
      });
      if (name === "greeting"){
          await Samples.createSample(taskSid, assistantUid, "hello", client)
      }
  }
  
  /**
   * Retrives json template of some predefined tasks.
   * 
   * @param {string} templateType - Name of template you want to retrieve.
   * 
   * @returns {Object} - Task template.
   */
  async function loadTemplate(templateType){
      if(templateType === "greeting"){
          return await templates.getGreeting()
      } else if (templateType === "goodbye"){
          return await templates.getGoodbye()
      } else if (templateType === "collect_fallback"){
          return await templates.getCollectFallback()
      } else if (templateType === "fallback"){
          return await templates.getFallback()
      }  else if (templateType === "stylesheet"){
          return await templates.getStyleSheet()
      }
    }

  /**
   * Upload predefined stylesheet
   * 
   * @param {string} assistantUid - Twilio assistant id.
   * @param {Object} client - Twilio API client object.
   * 
   */
   async function uploadStylesheet(assistantUid, client){
       var stylesheet = await loadTemplate("stylesheet")
       await client.autopilot.assistants(assistantUid)
                    .styleSheet()
                    .update({styleSheet: stylesheet})
    }

  /**
   * Creates all Twilio tasks including predefined ones such as
   * greeting, goodbye, etc..
   * 
   * @param {string} assistantUid - Twilio assistant id.
   * @param {string} serviceUid - Twilio service id.
   * @param {Object} tasks - All tasks to be uploaded.
   * @param {Object} client - Twilio API client object.
   */
  async function uploadTasks(assistantUid, serviceUid, tasks, client){
      var greeting = await loadTemplate("greeting");
      var goodbye = await loadTemplate("goodbye")
      var collect_fallback = await loadTemplate("collect_fallback")
      var fallback = await loadTemplate("fallback")
      var uri = await Functions.fetchFunctionUri(serviceUid, client)
      var collecturi = "https://" + (await uri) + "/collect"


      for(var key in tasks){
          var uniqueName = key
          var taskData = JSON.stringify(tasks[key])
          taskData = taskData.replace("bot_uri_holder", collecturi)
          if(key.slice(0,5) === "start"){
            uniqueName = uniqueName.replace("start", "")
            greeting["actions"]["actions"][0]["redirect"] += uniqueName
            await createTask("greeting", greeting["actions"], assistantUid, client)
        }

          await createTask(uniqueName, JSON.parse(taskData), assistantUid, client)
        }

        await createTask("goodbye", goodbye, assistantUid, client)
        await createTask("collect_fallback", collect_fallback, assistantUid, client)
        await createTask("fallback", fallback, assistantUid, client)
  }

  /**
   * Create a service which will handle task routing.
   * 
   * @param {string} botname - Name you want to assign bot.
   * @param {Object} mapping - Mapping between tasks.
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {string} - id of newly created service.
   */
  async function createBotService(botname, mapping, client){
      var serviceUid = await Services.createService(botname, client);
      var functionUid = await Functions.createFunction(serviceUid, client)
      await Functions.createFunctionResource(serviceUid, functionUid, client)
      var assetUid = await Assets.createAsset(serviceUid, client)
      await Assets.createAssetResource(serviceUid, assetUid, mapping, client)
      var functionVersionUid = await Functions.getFunctionVersion(serviceUid, functionUid, client)
      var assetVersionUid = await Assets.getAssetVersion(serviceUid, assetUid, client)
      var environmentUid = await Services.createEnvironment(serviceUid, client)
      var buildUid = await Services.createBuild(serviceUid, functionVersionUid, assetVersionUid, client)
      while (await Services.getBuildStatus(serviceUid, buildUid, client) !== "completed"){}
      await Services.createDeployment(serviceUid, environmentUid, buildUid, client)
      return serviceUid
  
  }
  
  /**
   * Create a bot including uploading all tasks, samples etc..
   * and generating a model.
   * 
   * @param {string} botname - name of bot.
   * @param {string} serviceUid - Twilio service id.
   * @param {Object} tasks - All tasks for bot.
   * @param {Object} client - Twilio API client object.
   * 
   * @returns {string} - assitant id for newly created bot.
   */
  async function createBot(botname, serviceUid, tasks, client){
      var assistantUid = await Assistants.createAssistant(botname, client)
      await uploadTasks(assistantUid, serviceUid, tasks, client)
      await Assistants.setDefaults(assistantUid, client)
      await uploadStylesheet(assistantUid, client)
      await Assistants.createModel(assistantUid, client)
      return assistantUid
  }


    if(typeof(client) !== "object" || client === null){
        throw new TwilioRequestError("Missing Client")
    }


    if(typeof(bot) !== "object" || bot === null){
        throw new ValidationError("Missing bot")
    } 

    var botname = bot.name
    var diagram = bot.diagram
    
    if (botname === null){
        throw new ValidationError("Missing Bot Name")
    } else if (diagram === null){
        throw new ValidationError("Missing Bot Diagram")
    }

    botname = bot.timestamp + "-" + botname

    try {
        if((await validate.serviceNameAvaialble(client, botname)) === true &&  
        (await validate.assistantNameAvailable(client, botname) === true) && 
        (await validate.validateUBF(bot.diagram) == true)){
            var tasksAndMapping = await taskGen(diagram);
            
            if(tasksAndMapping === null){
                throw new ValidationError("Tasks and Mapping are missing.")
            }

            var serviceUid = await createBotService(botname, tasksAndMapping.mapping, client);  
            let assistantUid = await createBot(botname, serviceUid, tasksAndMapping.tasks, client);
            return assistantUid
        } else{
            throw new ValidationError(`${botname} already in use.`)
        }
    } catch (e) {
        throw new ValidationError(e.message);
    }
    
  }
  

module.exports = {uploadNewBot}