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
    unlinked.getUnlinkedBots(client).then(resp => {
        expect(resp).toEqual([])
    })
})