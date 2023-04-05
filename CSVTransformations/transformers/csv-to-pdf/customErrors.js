class ConversionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConversionError";
    this.statusCode = 500;
  }
}

class CsvParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "CsvParseError";
    this.statusCode = 400;
  }
}

class PdfGenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = "PdfGenerationError";
    this.statusCode = 500;
  }
}

module.exports = {
  ConversionError,
  CsvParseError,
  PdfGenerationError,
};
