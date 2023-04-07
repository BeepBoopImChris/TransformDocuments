const express = require("express");
const router = express.Router();
const xlsxUploadToDisk = require("../../middleware/xlsx-upload-to-disk");
const { convertXlsxToJpg } = require("../../transformers/XLSXTransformers/xlsx-to-jpg/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/XLSXTransformers/xlsx-to-jpg/errorHandler");
const inputFilePath = req.file.path;

const path = require("path");

router.post("/", xlsxUploadToDisk.single("xlsxfile"), async (req, res, next) => {
    try {
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".xlsx") {
      throw new InvalidFileTypeError("Invalid file type. Only XLSX files are allowed.");
    }
    
    const outputFiles = await convertXlsxToJpg(inputFilePath);
    const zipBuffer = await outputFiles.toBuffer();
    const filename = req.file.originalname.slice(0, -5);

    res.setHeader("Content-Disposition", `attachment; filename=${filename}-images.zip`);
    res.setHeader("Content-Type", "application/zip");
    res.send(zipBuffer);
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
