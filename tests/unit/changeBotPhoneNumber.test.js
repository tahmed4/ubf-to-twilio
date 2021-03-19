const changeNumber = require("../../lib/changeBotPhoneNumber")
jest.mock("../../import-lib/Numbers")

describe("Testing with mock client", () => {
    let client;

    beforeEach(() => {
        client = {"accountSid":"valid", "authKey":"valid"}
      });

    test("Change webhook successfully", async () => {
        let resp = await changeNumber.changeBotPhoneNumber(client, "test-1", "+447958293912")
        expect(resp).toBe(true)
        })
    
    test("No Phone Number", async () => {
        try {
            let resp = await changeNumber.changeBotPhoneNumber(client, "test-1", null)
        } catch(e){
            expect(e.name).toEqual("TwilioRequestError")
        }
        })
    
    test("Invalid Phone Number", async () => {
        try {
            let resp = await changeNumber.changeBotPhoneNumber(client, "test-1", "+9284810284")
        } catch(e){
            expect(e.name).toEqual("TwilioRequestError")
        }
        })    
})


test("Invalid Twilio Credentials", () => {
    let client = {"accountSid":"invalid", "authKey":"invalid"}
    changeNumber.changeBotPhoneNumber(client, "", "").catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    let client = null
    changeNumber.changeBotPhoneNumber(client, "", "").catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    let client = undefined
    changeNumber.changeBotPhoneNumber(client, "", "").catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

