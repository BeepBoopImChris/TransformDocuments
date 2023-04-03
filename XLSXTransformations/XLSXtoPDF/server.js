const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const exceljs = require('exceljs');
const puppeteer = require('puppeteer');
const workbookToHTML = require('./xlsxToHtml');
const htmlToPDF = require('./htmlToPdf');
const path = require('path');
const { InvalidFileError, CorruptFileError } = require('./errors');

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/octet-stream/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = path.extname(file.originalname).toLowerCase() === '.xlsx';

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new InvalidFileError('Invalid file type. Only XLSX files are supported.'));
  },
});

app.use(morgan('combined'));

let browserWSEndpoint;

(async () => {
  const browser = await puppeteer.launch();
  browserWSEndpoint = browser.wsEndpoint();
})();

app.post('/xlsx-to-pdf', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No XLSX file provided');
  }

  try {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(req.file.buffer).catch((error) => {
      if (error.message.includes('End of data reached')) {
        throw new CorruptFileError('Corrupt XLSX file');
      } else {
        throw new InvalidFileError('Invalid or corrupt XLSX file');
      }
    });

    const fontStyle = req.query.fontStyle || 'Arial';
    const html = await workbookToHTML(workbook, fontStyle);
    const pdf = await htmlToPDF(html, browserWSEndpoint);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
});

function errorHandler(err, req, res, next) {
  if (err instanceof InvalidFileError) {
    return res.status(400).send(err.message);
  } else if (err instanceof CorruptFileError) {
    return res.status(400).send(err.message);
  }
  console.error(err);
  res.status(500).send('Failed to convert XLSX to PDF');
}

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
