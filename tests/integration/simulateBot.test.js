const simulate = require("../../lib/simulateBot.js")
const twilio = require("twilio")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


describe("Testing with real client", () => {

    let client;

    beforeEach(() => {
        client = twilio(accountSid, authToken)
      });


    test("Simulate deployed bot", async () => {
        let id = "UAe7825031253f79d6c20913871c2aa812"
        let text = "hello"
        resp = await simulate.simulateBot(client, id, text)
        expect(resp[0]).toBe("Thanks for contacting our store! I can help you book a new appointment, modify an existing one or tell you about upcoming appointments. How can I help you today?")
    })

    test("Simulate deployed bot with empty text response", async () => {
        let id = "UA6395746dc0cfb5a2c309dd730f606801"
        let text = "hello"
        resp = await simulate.simulateBot(client, id, text)
        expect(resp).toEqual([])
    })

    test("Invalid Assistant", () => {
        let id = "invalid"
        let text = "hello"
        simulate.simulateBot(client, id, text).catch(resp => {
            expect(resp.name).toEqual("TwilioRequestError")
        })
    })

    test("Undefined Text", () => {
        let id = "UAe7825031253f79d6c20913871c2aa812"
        let text = undefined
        simulate.simulateBot(client, id, text).catch(resp => {
            expect(resp.name).toEqual("TwilioRequestError")
        })
    })

    test("Null as text", () => {
        let id = "UAe7825031253f79d6c20913871c2aa812"
        let text = null
        simulate.simulateBot(client, id, text).catch(resp => {
            expect(resp.name).toEqual("TwilioRequestError")
        })
    })
})

test("Invalid Client", () => {
    let client = twilio("ACInvalid", "client")
    let id = "UAe7825031253f79d6c20913871c2aa812"
    let text = "hello"
    simulate.simulateBot(client, id, text).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    let client = null
    let id = "UAe7825031253f79d6c20913871c2aa812"
    let text = "hello"
    simulate.simulateBot(client, id, text).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    let client = undefined
    let id = "UAe7825031253f79d6c20913871c2aa812"
    let text = "hello"
    simulate.simulateBot(client, id, text).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})
