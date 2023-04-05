const express = require("express");
const router = express.Router();
const csvUpload = require("../middleware/csv-upload");
const { convertCsvToPdf } = require("../transformers/csv-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../transformers/csv-to-pdf/customErrors");
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

    const pdfBuffer = await convertCsvToPdf(req.file.buffer);
    const filename = req.file.originalname.slice(0, -4);

    res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
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
