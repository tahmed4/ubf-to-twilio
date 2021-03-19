const deployed = require("../../lib/getDeployedBots")
const twilio = require("twilio")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


test("Return all fully deployed bots on an account", async () => {
    let client = twilio(accountSid, authToken)
    let resp = await deployed.getDeployedBots(client)
    expect(resp).toEqual([{"phoneNumber": "+447782602063", "name": "msk-alexa-1", "id": "UAa556f1a138444cf5359020bba46f017e", "diagram": null, "timestamp": "1615418711887"}])
    })

test("Invalid Twilio Credentials", () => {
    let client = twilio("ACinvalid", "credentials")
    deployed.getDeployedBots(client).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    deployed.getDeployedBots(null).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    deployed.getDeployedBots(undefined).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})
    
    