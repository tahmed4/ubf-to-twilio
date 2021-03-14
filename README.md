[![NPM](https://nodei.co/npm/ubf-to-twilio.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ubf-to-twilio/)

# What is this?

Bundles together multiple Twilio API calls to let you easily deploy a chatbot in a few requests.

# Installation

`npm i ubf-to-twilio`

# Usage
```
const api = require("ubf-to-twilio")

//Retrieve Twilio Client.
client = await api.tryConnectingToTwilio({"username": "TwilioAccountSid", "password": "TwilioAuthToken"})

//List all Phone Numbers on an Account.
numbers = await api.getSMSAccountPhoneNumbers(client)

//Retrieve all Fully Initialised Bots on an Account.
bots = await api.getDeployedBots(client)

//Get back all Bots that have no linked Twilio Service.
unlinked_bots = await api.getUnlinkedBots(client)

//Upload your Chatbot.
assistant_id = await api.uploadNewBot(client, bot)

//Set the SMS webhook of a specific number.
api.changeBotPhoneNumber(client, assistant_id, "+447123456789")

//Simulate a Conversation with your Chatbot.
simulated_text = await api.simulateBot(client, assistant_id, "Text you want to simulate!")

//Remove your Chatbot.
api.removeBot(client, assistant_id)

```