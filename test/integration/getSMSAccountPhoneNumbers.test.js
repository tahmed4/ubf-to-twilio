const phonenumbers = require("../../lib/getSMSAccountPhoneNumbers.js")
const twilio = require("twilio")

test("Return all numbers on an account", () => {
    let client = twilio("AC16497ae92be880bf536ddf0d8ae92add", "9e9acd8216a57baac83559ee8df1ee00")
    phonenumbers.getSMSAccountPhoneNumbers(client).then(resp => {
        expect(resp).toEqual(["+447782602063"])
    })
})

test("Invalid Twilio Credentials", () => {
    let client = twilio("ACInvalid", "Credentials")
    phonenumbers.getSMSAccountPhoneNumbers(client).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    phonenumbers.getSMSAccountPhoneNumbers(null).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    phonenumbers.getSMSAccountPhoneNumbers(undefined).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})