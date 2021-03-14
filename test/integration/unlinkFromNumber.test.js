const unlink = require("../../lib/unlinkFromNumber")
const changeNumber = require("../../lib/changeBotPhoneNumber")
const twilio = require("twilio")


test("Free deployed bot", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    let resp = await unlink.unlinkFromPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e")
    expect(resp).toBe(true)
    await changeNumber.changeBotPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e", "+44778260206")
    })

test("Attempt to free undeployed assistant", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    let resp = await unlink.unlinkFromPhoneNumber(client, "")
    expect(resp).toBe(false)
    })

test("Attempt to free null assistant", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    let resp = await unlink.unlinkFromPhoneNumber(client, null)
    expect(resp).toBe(false)
    })

test("Attempt to free undefined assistant", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    let resp = await unlink.unlinkFromPhoneNumber(client, undefined)
    expect(resp).toBe(false)
    })


test("Invalid Twilio Credentials", () => {
    let client = twilio("ACInvalid", "Credentials")
    unlink.unlinkFromPhoneNumber(client, "", "").catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    let client = null
    unlink.unlinkFromPhoneNumber(client, "").catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    let client = undefined
    unlink.unlinkFromPhoneNumber(client, "").catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})
    
    