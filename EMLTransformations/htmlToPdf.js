const puppeteer = require('puppeteer');
const { PdfConversionError, ValidationError } = require('./errorHandler');

async function convertHtmlToPdf(html, subject) {
  if (!html || typeof html !== 'string') {
    throw new ValidationError('html must be a non-empty string');
  }

  if (!subject || typeof subject !== 'string') {
    throw new ValidationError('subject must be a non-empty string');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    throw new PdfConversionError(`Error during PDF conversion: ${error.message}`);
  }
}

module.exports = convertHtmlToPdf;
