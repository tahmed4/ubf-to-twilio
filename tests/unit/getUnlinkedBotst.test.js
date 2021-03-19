const unlinked =  require("../../lib/getUnlinkedBots")
jest.mock("../../import-lib/Numbers")
jest.mock("../../import-lib/Assistants")

test("Fetch Unlinked Bots on valid account", () => {
    client = {"accountSid":"valid", "authKey":"valid"}
    unlinked.getUnlinkedBots(client).then(resp => {
        expect(resp).toEqual([{"diagram": null, "id": "test-3", "name": "test-3", "phoneNumber": null, "timestamp": "1"}])
    })
})

test("Fetch Deployed Bots with invalid credentials", () => {
    client = {"accountSid":"invalid", "authKey":"invalid"}
    unlinked.getUnlinkedBots(client).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Null Client", () => {
    unlinked.getUnlinkedBots(null).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})

test("Undefined Client", () => {
    unlinked.getUnlinkedBots(undefined).catch(resp => {
        expect(resp.name).toEqual("TwilioRequestError")
    })
})
    