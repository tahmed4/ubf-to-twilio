const connect = require("../../lib/tryConnectingToTwilio.js")
jest.mock("../../lib/tryConnectingToTwilio.js")

test("Connect to Twilio with valid credentials", async () => {
    resp = await connect.twilioConnect("AC16497ae92be880bf536ddf0d8ae92add", "49dcec040cfa3c1b6e08e9556a5eb9ab")
    expect(resp._httpClient.lastResponse.statusCode).toBe(200)
 })


 test("Connect with undefined credentials", async () => {
    try{
        resp = await connect.twilioConnect(undefined, undefined)
    } catch(e){
        expect(e.name).toBe("TwilioRequestError")
    }
 })

 test("Connect with null credentials", async () => {
    try{
        resp = await connect.twilioConnect(null, null)
    } catch(e){
        expect(e.name).toBe("TwilioRequestError")
    }
 })

 test("Connect with invalid credentials", async () => {
    try{
        resp = await connect.twilioConnect("ACInvalid", "Credentials")
    } catch(e){
        expect(e.message).toBe("Invalid Twilio Credentials")
    }
 })