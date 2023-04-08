const { parse } = require("papaparse");
const PDFDocument = require("pdfkit");
const { CsvParseError, PdfGenerationError } = require("./customErrors");
const fs = require("fs");
const path = require("path");

async function convertCsvToPdf(csvBuffer) {
  try {
    const csvString = csvBuffer.toString("utf8");
    const { data, errors } = await parse(csvString, { header: true });

    if (errors.length > 0) {
      throw new CsvParseError("An error occurred while parsing the CSV file.");
    }

    // Define output path and filename
    const outputPath = path.join(__dirname, '..', '..', '..', 'output');
    const outputFilename = `output-${Date.now()}.pdf`;
    const outputPathFile = path.join(outputPath, outputFilename);
    
    // Create new PDF document and write stream to output file
    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(outputPathFile);

    doc.pipe(writeStream);

    // Define table dimensions and positions
    const headerColumns = Object.keys(data[0]);
    const numberOfRows = data.length;
    const columnWidth = (doc.page.width - 100) / headerColumns.length;
    const rowHeight = 20;

    let yPosition = 100;

    // Draw header background
    doc.rect(40, 80, doc.page.width - 80, rowHeight)
      .fill("#CCCCCC");

    // Render table headers
    let xPosition = 50;
    for (let column of headerColumns) {
      doc.fillColor("black")
        .font("Helvetica-Bold")
        .text(column, xPosition, yPosition);
      xPosition += columnWidth;
    }

    // Render table rows
    yPosition = 120;

    for (let i = 0; i < numberOfRows; i++) {
      xPosition = 50;

      // Alternating row colors
      if (i % 2 === 0) {
        doc.rect(40, yPosition, doc.page.width - 80, rowHeight)
          .fill("#F0F0F0");
      }

      for (let column of headerColumns) {
        doc.fillColor("black")
          .font("Helvetica")
          .text(String(data[i][column]), xPosition, yPosition + 4); // Slight vertical adjustment for better alignment
        xPosition += columnWidth;
      }

      // Draw horizontal lines for table borders
      doc.moveTo(40, yPosition)
        .lineTo(doc.page.width - 40, yPosition)
        .stroke();

      yPosition += rowHeight;
    }

    // Draw vertical lines for table borders
    xPosition = 50;
    for (let i = 0; i <= headerColumns.length; i++) {
      doc.moveTo(xPosition, 80)
        .lineTo(xPosition, yPosition)
        .stroke();

      xPosition += columnWidth;
    }

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        resolve(outputPathFile);
      });
      writeStream.on("error", (error) => {
        reject(new PdfGenerationError("An error occurred during PDF generation."));
      });
    });
  } catch (error) {
    if (error instanceof CsvParseError || error instanceof PdfGenerationError) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred during the conversion process.");
    }
  }
}

module.exports = {
  convertCsvToPdf,
};
