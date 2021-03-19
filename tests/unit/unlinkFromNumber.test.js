const unlink = require("../../lib/unlinkFromNumber")
jest.mock("../../import-lib/Numbers")

describe("Testing with real client", () => {

    let client;

    beforeEach(() => {
        client = {"accountSid":"valid", "authKey":"valid"}
      });

    test("Free deployed bot", async () => {
        let resp = await unlink.unlinkFromPhoneNumber(client, "test-1")
        expect(resp).toBe(true)
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
        let client = {"accountSid":"invalid", "authKey":"invalid"}
        unlink.unlinkFromPhoneNumber(client, "").catch(resp => {
            expect(resp.name).toEqual("TwilioRequestError")
        })
    })
    
    invalidClient(null)
    invalidClient(undefined)
})

    