class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

class ValidationError extends ErrorHandler {
  constructor(message) {
    super(400, message || 'Bad Request: Invalid input provided');
  }
}

class ConversionError extends ErrorHandler {
  constructor(message) {
    super(500, message || 'Error during EML parsing');
  }
}

class PdfConversionError extends ErrorHandler {
  constructor(message) {
    super(500, message || 'Error during PDF conversion');
  }
}

class FormattingError extends ErrorHandler {
  constructor(message) {
    super(500, message || 'Error during content formatting');
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;

  const errorResponse = {
    status: 'error',
    statusCode,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    console.error(err.stack); // Log the error stack trace in the console
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = {
  ErrorHandler,
  ValidationError,
  ConversionError,
  PdfConversionError,
  FormattingError,
  handleError,
};
