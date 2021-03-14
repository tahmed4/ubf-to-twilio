const phonenumbers = require("../../lib/getSMSAccountPhoneNumbers.js")
const twilio = require("twilio")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

test("Return all numbers on an account", () => {
    let client = twilio(accountSid, authToken)
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