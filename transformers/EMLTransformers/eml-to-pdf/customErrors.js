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
  
  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
      this.statusCode = 400;
    }
  }
  
  class FormattingError extends Error {
    constructor(message) {
      super(message);
      this.name = "FormattingError";
      this.statusCode = 500;
    }
  }
  
  module.exports = {
    FileNotFoundError,
    InvalidFileTypeError,
    ValidationError,
    FormattingError,
  };
  