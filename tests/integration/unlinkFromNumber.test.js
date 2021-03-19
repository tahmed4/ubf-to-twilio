const unlink = require("../../lib/unlinkFromNumber")
const changeNumber = require("../../lib/changeBotPhoneNumber")
const twilio = require("twilio")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

describe("Testing with real client", () => {

    let client;

    beforeEach(() => {
        client = twilio(accountSid, authToken)
      });

    test("Free deployed bot", async () => {
        let resp = await unlink.unlinkFromPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e")
        expect(resp).toBe(true)
        await changeNumber.changeBotPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e", "+44778260206")
        })
    
    test("Attempt to free undeployed assistant", async () => {
        let resp = await unlink.unlinkFromPhoneNumber(client, "")
        expect(resp).toBe(false)
        })
    
    test("Attempt to free null assistant", async () => {
        let resp = await unlink.unlinkFromPhoneNumber(client, null)
        expect(resp).toBe(false)
        })
    
    test("Attempt to free undefined assistant", async () => {
        let resp = await unlink.unlinkFromPhoneNumber(client, undefined)
        expect(resp).toBe(false)
        })
})

describe("Invalid Client Tests", () =>{
    function invalidClient(client){
        test("Invalid Client Definitions", () => {
            unlink.unlinkFromPhoneNumber(client, "").catch(resp => {
                expect(resp.name).toEqual("TwilioRequestError")
            })
        })
    }

    test("Invalid Twilio Credentials", () => {
        let client = twilio("ACInvalid", "Credentials")
        unlink.unlinkFromPhoneNumber(client, "").catch(resp => {
            expect(resp.name).toEqual("TwilioRequestError")
        })
    })
    
    invalidClient(null)
    invalidClient(undefined)
})

    