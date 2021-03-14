const connect = require("../../lib/tryConnectingToTwilio.js")

test("Connect to Twilio with valid credentials", async () => {
    resp = await connect.twilioConnect("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
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