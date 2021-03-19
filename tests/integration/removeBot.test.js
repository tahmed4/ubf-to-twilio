const upload = require("../../lib/uploadNewBot.js")
const remove = require("../../lib/removeBot.js")
const Assistants = require("../../import-lib/Assistants.js")
const twilio = require("twilio")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

describe("Testing with real client", () => {
    let client;

    beforeEach(() => {
        client = twilio(accountSid, authToken)
      });

    test("Remove Uploaded Bot", async () => {
        var bot = {"phoneNumber": null, "name": "test", "id": null, "diagram": {"project":{"nodes":{"5f9f562f11b31520c2a2a6de":{"type":"start","next":"604b529f53e5d940a61a34f2"},"604b529f53e5d940a61a34f2":{"type":"speak","content":"Hello","next":"604b52a453e5d940a61a34fc"},"604b52a453e5d940a61a34fc":{"type":"speak","content":"Goodbye","next":null}},"name":"Voiceflow Project"}}, "timestamp": new Date().getTime()}
        id = await upload.uploadNewBot(client,bot)
        await remove.removeBot(client, id)
        assistantData = (await Assistants.getAssistants(client)).assistants
        expect(assistantData.includes(id)).toBe(false)
     })

    test("Empty Assistant ID", async () => {
        var id = ""
        try{
            await remove.removeBot(client, id)
        } catch (e){
            expect(e.name).toBe("TwilioRequestError")
        }
    })
    

    test("Null Assistant ID", async () => {
        var id = null
        try{
            await remove.removeBot(client, id)
        } catch (e){
            expect(e.name).toBe("TwilioRequestError")
        }
    })

    test("Undefined Assistant ID", async () => {
        var id = undefined
        try{
            await remove.removeBot(client, id)
        } catch (e){
            expect(e.name).toBe("TwilioRequestError")
        }
    })
})

test("Undefined Client", async () => {
    var client = undefined
    var id = "UAa556f1a138444cf5359020bba46f017e"
    try{
        await remove.removeBot(client, id)
    } catch (e){
        expect(e.name).toBe("TwilioRequestError")
    }
 })

 test("Null Client", async () => {
    var client = null
    var id = "UAa556f1a138444cf5359020bba46f017e"
    try{
        await remove.removeBot(client, id)
    } catch (e){
        expect(e.name).toBe("TwilioRequestError")
    }
 })