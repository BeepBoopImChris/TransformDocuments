// Require Express and create a router instance
const express = require("express");
const router = express.Router();

// Import middleware and functions for converting EML to PDF
const emlUpload = require("../../middleware/eml-upload");
const { convertEmlToPdf } = require("../../transformers/EMLTransformers/eml-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/EMLTransformers/eml-to-pdf/customErrors");
const path = require("path");

// Define a route handler for POST requests to /eml-to-pdf
router.post("/", emlUpload.single("emlfile"), async (req, res, next) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    // Check if the uploaded file is an EML
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".eml") {
      throw new InvalidFileTypeError("Invalid file type. Only EML files are allowed.");
    }

    // Convert the EML to PDF and send the download link in the response
    const outputFile = await convertEmlToPdf(req.file.buffer);
    const downloadLink = `${req.protocol}://${req.get("host")}/output/${path.basename(outputFile)}`;

    res.status(200).json({
      success: true,
      message: "File converted successfully.",
      downloadLink: downloadLink,
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
});

// Define an error handler middleware for this router
router.use((err, req, res, next) => {
  // If the error is one of our custom errors, send the error message and status code in the response
  if (err instanceof FileNotFoundError || err instanceof InvalidFileTypeError) {
    res.status(err.statusCode).send(err.message);
  } else {
    // Otherwise, pass the error to the next middleware in the stack
    next(err);
  }
});

module.exports = router;
