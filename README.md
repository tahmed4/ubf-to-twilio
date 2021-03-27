[![NPM](https://nodei.co/npm/ubf-to-twilio.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ubf-to-twilio/)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Tests](https://github.com/tahmed4/ubf-to-twilio/actions/workflows/test.yml/badge.svg)](https://github.com/tahmed4/ubf-to-twilio/actions/workflows/test.yml)

# What is this?

Bundles together multiple Twilio API calls to let you easily deploy a chatbot in a few requests.

## Documentation

The documentation for the ubf-to-twilio can be found [here][apidocs].

## Versions

### Supported Node.js Versions

This package supports the following Node.js implementations:

* Node.js 6
* Node.js 8
* Node.js 10
* Node.js 12
* Node.js 14

# Installation

`npm i ubf-to-twilio`

or 

`yarn add ubf-to-twilio`

# Usage
```
const api = require("ubf-to-twilio")

//Retrieve Twilio Client for API calls.
client = await api.tryConnecting({"username": "TwilioAccountSid", "password": "TwilioAuthToken"})

//List all Phone Numbers on a Twilio Account.
numbers = await api.getSMSAccountPhoneNumbers(client)

//Retrieve all Fully Initialised Chatbots on an Account.
bots = await api.getDeployedBots(client)

//Get back all Chatbots that have no linked Twilio Service.
unlinked_bots = await api.getUnlinkedBots(client)

//Upload your Chatbot.
assistant_id = await api.uploadNewBot(client, bot)

//Set the SMS webhook of a specific number.
api.changeBotPhoneNumber(client, assistant_id, "+447123456789")

//Unset the SMS webhook of a specific chatbot.
api.unlinkFromNumber(client, assistant_id)

//Simulate a Conversation with your Chatbot.
simulated_text = await api.simulateBot(client, assistant_id, "Text you want to simulate!")

//Remove your Chatbot.
api.removeBot(client, assistant_id)

```

[apidocs]: http://sms-it.io/