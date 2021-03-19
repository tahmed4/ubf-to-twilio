const phonenumbers = require("../../lib/getSMSAccountPhoneNumbers.js")
jest.mock("../../import-lib/Numbers")

test("Return all numbers on an account", () => {
    let client = {"accountSid":"valid", "authKey":"valid"}
    phonenumbers.getSMSAccountPhoneNumbers(client).then(resp => {
        expect(resp).toEqual(["+447958293912", "+447942960231", "+447284920342"])
    })
})

test("Invalid Twilio Credentials", () => {
    let client = {"accountSid":"invalid", "authKey":"invalid"}
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