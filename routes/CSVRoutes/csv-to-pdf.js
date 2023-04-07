const express = require("express");
const router = express.Router();
const csvUpload = require("../../middleware/csv-upload");
const { convertCsvToPdf } = require("../../transformers/CSVTransformers/csv-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/CSVTransformers/csv-to-pdf/customErrors");
const path = require("path");

router.post("/", csvUpload.single("csvfile"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".csv") {
      throw new InvalidFileTypeError("Invalid file type. Only CSV files are allowed.");
    }

    const outputFile = await convertCsvToPdf(req.file.buffer);
    const filename = req.file.originalname.slice(0, -4);
    const downloadLink = `http://${req.headers.host}/output/${path.basename(outputFile)}`;

    res.json({
      success: true,
      message: "File converted successfully.",
      downloadLink,
    });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  if (err instanceof FileNotFoundError || err instanceof InvalidFileTypeError) {
    res.status(err.statusCode).send(err.message);
  } else {
    next(err);
  }
});

module.exports = router;
