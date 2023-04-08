class FileNotFoundError extends Error {
  constructor(message) {
    super(message); // Call the constructor of the Error class with the error message
    this.name = "FileNotFoundError"; // Set the name property to a custom value
    this.statusCode = 400; // Set the statusCode property to a custom value
  }
}

class InvalidFileTypeError extends Error {
  constructor(message) {
    super(message); // Call the constructor of the Error class with the error message
    this.name = "InvalidFileTypeError"; // Set the name property to a custom value
    this.statusCode = 400; // Set the statusCode property to a custom value
  }
}

module.exports = {
  FileNotFoundError,
  InvalidFileTypeError,
};
