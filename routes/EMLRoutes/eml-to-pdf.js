const express = require("express");
const router = express.Router();
const emlUpload = require("../../middleware/eml-upload"); 
const { convertEmlToPdf } = require("../../transformers/EMLTransformers/eml-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/EMLTransformers/eml-to-pdf/customErrors");
const path = require("path");

router.post("/", emlUpload.single("emlfile"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".eml") {
      throw new InvalidFileTypeError("Invalid file type. Only eml files are allowed.");
    }

    const pdfBuffer = await convertEmlToPdf(req.file.buffer); 
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
