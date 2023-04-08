const express = require("express");
const router = express.Router();

const htmlUpload = require("../../middleware/html-upload");
const { convertHtmlToPdf } = require("../../transformers/HTMLTransformers/html-to-pdf/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../../transformers/HTMLTransformers/html-to-pdf/customErrors"); // Add this line
const path = require("path");

router.post("/", htmlUpload.single("htmlfile"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new FileNotFoundError("No file uploaded.");
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (fileExtension !== ".html") {
      throw new InvalidFileTypeError("Invalid file type. Only HTML files are allowed.");
    }

    const outputFile = await convertHtmlToPdf(req.file.buffer);
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
