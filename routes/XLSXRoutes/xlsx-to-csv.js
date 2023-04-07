const express = require("express");
const router = express.Router();
const xlsxUpload = require("../../middleware/xlsx-upload");
const { convertXlsxToCsv } = require("../../transformers/XLSXTransformers/xlsx-to-csv/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/XLSXTransformers/xlsx-to-csv/customErrors");
const path = require("path");

router.post("/", xlsxUpload.single("xlsxfile"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".xlsx") {
      throw new InvalidFileTypeError("Invalid file type. Only XLSX files are allowed.");
    }

    const outputFile = await convertXlsxToCsv(req.file.buffer);
    const filename = req.file.originalname.slice(0, -5);
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
