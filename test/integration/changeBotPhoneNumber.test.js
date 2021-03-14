const changeNumber = require("../../lib/changeBotPhoneNumber")
const twilio = require("twilio")

test("Change webhook successfully", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    let resp = await changeNumber.changeBotPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e", "+44778260206")
    expect(resp).toBe(true)
    })

test("No Phone Number", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    try {
        let resp = await changeNumber.changeBotPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e", null)
    } catch(e){
        expect(e.name).toEqual("TwilioRequestError")
    }
    })

test("Invalid Phone Number", async () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    try {
        let resp = await changeNumber.changeBotPhoneNumber(client, "UAa556f1a138444cf5359020bba46f017e", "+9284810284")
    } catch(e){
        expect(e.name).toEqual("TwilioRequestError")
    }
    })


test("Invalid Twilio Credentials", () => {
    let client = twilio("ACInvalid", "Credentials")
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

