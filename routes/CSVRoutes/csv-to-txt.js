// Require Express and create a router instance
const express = require("express");
const router = express.Router();

// Import middleware and functions for converting CSV to TXT
const csvUpload = require("../../middleware/csv-upload");
const { convertCsvToTxt } = require("../../transformers/CSVTransformers/csv-to-txt/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/CSVTransformers/csv-to-txt/customErrors");
const path = require("path");

// Define a route handler for POST requests to /csv-to-txt
router.post("/", csvUpload.single("csvfile"), async (req, res, next) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    // Check if the uploaded file is a CSV
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".csv") {
      throw new InvalidFileTypeError("Invalid file type. Only CSV files are allowed.");
    }

    // Convert the CSV to TXT and send the download link in the response
    const outputFile = await convertCsvToTxt(req.file.buffer);
    const filename = req.file.originalname.slice(0, -4);
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
