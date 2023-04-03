const express = require('express');
const multer = require('multer');
const parseEml = require('./emlParser');
const convertHtmlToPdf = require('./htmlToPdf');
const formatEmailContent = require('./formatter');
const { ErrorHandler, handleError } = require('./errorHandler');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/convert', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler(400, 'No EML file provided'));
  }

  try {
    const { content, subject } = await parseEml(req.file.buffer);
    const formattedContent = formatEmailContent(content);
    const pdfBuffer = await convertHtmlToPdf(formattedContent, subject);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${subject}.pdf`);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Original error:', error); // Log the original error
    next(new ErrorHandler(500, 'Internal server error'));
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  handleError(err, res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
