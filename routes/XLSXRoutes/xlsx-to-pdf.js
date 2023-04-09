// Require Express and create a router instance
const express = require("express");
const router = express.Router();

// Import middleware and functions for converting XLSX to PDF
const xlsxUpload = require("../../middleware/xlsx-upload");
const { convertXlsxToPdf } = require("../../transformers/XLSXTransformers/xlsx-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/XLSXTransformers/xlsx-to-pdf/customErrors");
const path = require("path");

// Define a route handler for POST requests to /xlsx-to-pdf
router.post("/", xlsxUpload.single("xlsxfile"), async (req, res, next) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    // Check if the uploaded file is an XLSX
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".xlsx") {
      throw new InvalidFileTypeError("Invalid file type. Only XLSX files are allowed.");
    }

    // Get font color from the request body
    const fontColor = req.body.fontColor || '0,0,0';

    // Convert the XLSX to PDF and send the download link in the response
    const pdfFilePath = await convertXlsxToPdf(req.file.buffer, fontColor);
    const fileName = path.basename(pdfFilePath);

    res.json({
      success: true,
      message: 'File converted successfully.',
      downloadLink: `${req.protocol}://${req.get('host')}/output/${fileName}`
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
