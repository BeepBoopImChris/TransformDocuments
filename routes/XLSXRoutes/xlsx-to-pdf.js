const express = require("express");
const router = express.Router();
const xlsxUpload = require("../../middleware/xlsx-upload");
const { convertXlsxToPdf } = require("../../transformers/XLSXTransformers/xlsx-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/XLSXTransformers/xlsx-to-pdf/customErrors");
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

    const pdfFilePath = await convertXlsxToPdf(req.file.buffer);
    const fileName = path.basename(pdfFilePath);

    res.json({
      success: true,
      message: 'File converted successfully.',
      downloadLink: `${req.protocol}://${req.get('host')}/output/${fileName}`
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
