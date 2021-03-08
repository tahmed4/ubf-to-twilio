/**
 * Contains all JSON schemas used to verify Universal Bot Format.
 */

function getUBFSchema(){
    return `{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "project": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "nodes": {
                "type": "object"
              }
            },
            "required": [
              "name",
              "nodes"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "project"
        ],
        "additionalProperties": false
      }`
}

function getUBFStartSchema(){
    return `{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["start"]
          },
          "next": {
            "type": "string"
          }
        },
        "required": [
          "type",
          "next"
        ],
        "additionalProperties": false
      }`

}

function getUBFSpeakSchema(){
    return `{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["speak"]
          },
          "content": {
            "type": "string"
          },
          "next": {
            "type": ["string", "null"]
          }
        },
        "required": [
          "type",
          "content",
          "next"
        ],
        "additionalProperties": false
      }`

}

function getUBFChoiceSchema(){
    return `{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "interaction"
            ]
          },
          "options": {
            "type": "array",
            "items": [
              {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "yes"
                    ]
                  },
                  "next": {
                    "type": [
                      "null",
                      "string"
                    ]
                  }
                },
                "required": [
                  "type",
                  "next"
                ],
                "additionalProperties": false
              },
              {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "no"
                    ]
                  },
                  "next": {
                    "type": [
                      "null",
                      "string"
                    ]
                  }
                },
                "required": [
                  "type",
                  "next"
                ],
                "additionalProperties": false
              }
            ],
            "minItems": 2,
            "maxItems": 2,
            "uniqueItems": true
          }
        },
        "required": [
          "type",
          "options"
        ],
        "additionalProperties": false
      }`
}

module.exports = {getUBFSchema, getUBFStartSchema, getUBFSpeakSchema, getUBFChoiceSchema}