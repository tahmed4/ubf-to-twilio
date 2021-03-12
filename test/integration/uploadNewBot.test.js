const upload = require("../../lib/uploadNewBot.js")
const remove = require("../../lib/removeBot.js")
const twilio = require("twilio")

jest.mock("../../import-lib/Functions.js")
jest.mock("../../import-lib/Assets.js")

test("Upload Valid Bot", async () => {
    var bot = {"phoneNumber": null, "name": "test", "id": null, "diagram": {"project":{"nodes":{"5f9f562f11b31520c2a2a6de":{"type":"start","next":"604b529f53e5d940a61a34f2"},"604b529f53e5d940a61a34f2":{"type":"speak","content":"Hello","next":"604b52a453e5d940a61a34fc"},"604b52a453e5d940a61a34fc":{"type":"speak","content":"Goodbye","next":null}},"name":"Voiceflow Project"}}, "timestamp": new Date().getTime()}
    client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "49dcec040cfa3c1b6e08e9556a5eb9ab")
    id = await upload.uploadNewBot(client,bot)
    expect(id.substring(0,2)).toBe("UA")
    await remove.removeBot(client, id)
 })

 test("Null Client", async () => {
    var bot = {"phoneNumber": null, "name": "test", "id": null, "diagram": {"project":{"nodes":{"5f9f562f11b31520c2a2a6de":{"type":"start","next":"604b529f53e5d940a61a34f2"},"604b529f53e5d940a61a34f2":{"type":"speak","content":"Hello","next":"604b52a453e5d940a61a34fc"},"604b52a453e5d940a61a34fc":{"type":"speak","content":"Goodbye","next":null}},"name":"Voiceflow Project"}}, "timestamp": new Date().getTime()}
    var client = null
    try{
        id = await upload.uploadNewBot(client,bot)
    } catch (e){
        expect(e.name).toBe("TwilioRequestError")
    }
 })

 test("Undefined Client", async () => {
    var bot = {"phoneNumber": null, "name": "test", "id": null, "diagram": {"project":{"nodes":{"5f9f562f11b31520c2a2a6de":{"type":"start","next":"604b529f53e5d940a61a34f2"},"604b529f53e5d940a61a34f2":{"type":"speak","content":"Hello","next":"604b52a453e5d940a61a34fc"},"604b52a453e5d940a61a34fc":{"type":"speak","content":"Goodbye","next":null}},"name":"Voiceflow Project"}}, "timestamp": new Date().getTime()}
    var client = undefined
    try{
        id = await upload.uploadNewBot(client,bot)
    } catch (e){
        expect(e.name).toBe("TwilioRequestError")
    }
 })

 test("Null Bot", async () => {
    var bot = null
    var client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "49dcec040cfa3c1b6e08e9556a5eb9ab")
    try{
        id = await upload.uploadNewBot(client,bot)
    } catch (e){
        expect(e.name).toBe("ValidationError")
    }
 })

 test("Undefined Bot", async () => {
    var bot = undefined
    var client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "49dcec040cfa3c1b6e08e9556a5eb9ab")
    try{
        id = await upload.uploadNewBot(client,bot)
    } catch (e){
        expect(e.name).toBe("ValidationError")
    }
 })

 test("Bot Missing Name", async () => {
    var bot = {"phoneNumber": null, "name": null, "id": null, "diagram": {"project":{"nodes":{"5f9f562f11b31520c2a2a6de":{"type":"start","next":"604b529f53e5d940a61a34f2"},"604b529f53e5d940a61a34f2":{"type":"speak","content":"Hello","next":"604b52a453e5d940a61a34fc"},"604b52a453e5d940a61a34fc":{"type":"speak","content":"Goodbye","next":null}},"name":"Voiceflow Project"}}, "timestamp": new Date().getTime()}
    client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "49dcec040cfa3c1b6e08e9556a5eb9ab")
    try{
        id = await upload.uploadNewBot(client,bot)
    } catch (e){
        expect(e.name).toBe("ValidationError")
    }
 })

 test("Bot Missing Diagram", async () => {
    var bot = {"phoneNumber": null, "name": "test", "id": null, "diagram": null, "timestamp": new Date().getTime()}
    client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "49dcec040cfa3c1b6e08e9556a5eb9ab")
    try{
        id = await upload.uploadNewBot(client,bot)
    } catch (e){
        expect(e.name).toBe("ValidationError")
    }
 })