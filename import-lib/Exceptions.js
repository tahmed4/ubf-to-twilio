class ValidationError extends Error {
    constructor(message) {
      super(message); 
      this.name = "ValidationError"; 
      this.message = message
    }
  }

class TwilioRequestError extends Error {
    constructor(message) {
      super(message); 
      this.name = "TwilioRequestError"; 
      this.message = message
    }
  }

class MalformedDiagramError extends Error {
    constructor(message) {
      super(message); 
      this.name = "MalformedDiagramError"; 
      this.message = message
    }
  }

module.exports = {ValidationError, TwilioRequestError, MalformedDiagramError}