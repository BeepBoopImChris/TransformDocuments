
class FileNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "FileNotFoundError";
      this.statusCode = 400;
    }
  }
  
  class InvalidFileTypeError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidFileTypeError";
      this.statusCode = 400;
    }
  }
  
  module.exports = {
    FileNotFoundError,
    InvalidFileTypeError,
  };
  