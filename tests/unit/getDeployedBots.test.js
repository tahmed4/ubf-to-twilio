const deployed = require("../../lib/getDeployedBots")
jest.mock("../../import-lib/Numbers")
jest.mock("../../import-lib/Assistants")

test("Fetch Deployed Bots on valid account", () => {
    client = {"accountSid":"valid", "authKey":"valid"}
    deployed.getDeployedBots(client).then(resp => {
        expect(resp).toEqual([{"phoneNumber": "+447958293912", "name": "test-1", "id": "test-1", "diagram": null, "timestamp": "1"}, {"phoneNumber":"+447942960231", "name": "test-2", "id": "test-2", "diagram": null, "timestamp": "1"}])
    })
})

test("Fetch Deployed Bots with invalid credentials", () => {
    client = {"accountSid":"invalid", "authKey":"invalid"}
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
    
