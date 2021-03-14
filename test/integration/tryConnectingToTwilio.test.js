const connect = require("../../lib/tryConnectingToTwilio.js")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

test("Connect to Twilio with valid credentials", async () => {
    resp = await connect.twilioConnect(accountSid, authToken)
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