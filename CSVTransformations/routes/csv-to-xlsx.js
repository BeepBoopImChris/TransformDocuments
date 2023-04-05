const express = require("express");
const router = express.Router();
const csvUpload = require("../middleware/csv-upload");
const { convertCsvToXlsx } = require("../transformers/csv-to-xlsx/converter");
const { FileNotFoundError, InvalidFileTypeError } = require("../transformers/csv-to-xlsx/customErrors");
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

    const xlsxBuffer = await convertCsvToXlsx(req.file.buffer);
    const filename = req.file.originalname.slice(0, -4);

    res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(xlsxBuffer);
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
