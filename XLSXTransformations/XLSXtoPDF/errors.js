class InvalidFileError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidFileError";
    }
  }
  
  class CorruptFileError extends Error {
    constructor(message) {
      super(message);
      this.name = "CorruptFileError";
    }
  }
  
  module.exports = { InvalidFileError, CorruptFileError };