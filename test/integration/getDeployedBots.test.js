const deployed = require("../../lib/getDeployedBots")
const twilio = require("twilio")


test("Return all fully deployed bots on an account", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
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
    
    