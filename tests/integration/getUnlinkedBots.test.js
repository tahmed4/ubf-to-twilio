const unlinked = require("../../lib/getUnlinkedBots")
const twilio = require("twilio")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


test("Return all unlinked bots on an account", async () => {
    let client = twilio(accountSid, authToken)
    let resp = await unlinked.getUnlinkedBots(client)
    expect(resp).toEqual([{ "phoneNumber": null, "name": "Test2", "id": "UA6395746dc0cfb5a2c309dd730f606801", "diagram": null, "timestamp": null },{ "phoneNumber": null, "name": "Test", "id": "UAe7825031253f79d6c20913871c2aa812", "diagram": null, "timestamp": null }])
    })

test("Invalid Twilio Credentials", () => {
    let client = twilio("ACinvalid", "credentials")
    unlinked.getUnlinkedBots(client).catch(resp => {
        return expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    unlinked.getUnlinkedBots(null).catch(resp => {
        return expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    unlinked.getUnlinkedBots(undefined).catch(resp => {
        return expect(resp.name).toEqual("TwilioRequestError")
    })
})
    