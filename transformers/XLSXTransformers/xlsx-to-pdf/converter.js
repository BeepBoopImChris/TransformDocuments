const ExcelJS = require('exceljs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '../../../output');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const convertXlsxToPdf = async (buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
  
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
    const worksheet = workbook.getWorksheet(1);
    let pageNumber = 1;
  
    let posY = 750;
    worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
      const page = pdfDoc.getPages()[pageNumber - 1] || pdfDoc.addPage([600, 800]);
  
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        const posX = colNumber * 80;
  
        // Draw cell background color for header row
        if (rowIndex === 1) {
          page.drawRectangle({
            x: posX - 2,
            y: posY - 2,
            width: 80,
            height: 20,
            color: rgb(0.9, 0.9, 0.9),
          });
        }
  
        // Draw cell borders
        page.drawLine({
          start: { x: posX - 2, y: posY - 2 },
          end: { x: posX + 78, y: posY - 2 },
          thickness: 0.5,
          color: rgb(0.8, 0.8, 0.8),
        });
  
        page.drawLine({
          start: { x: posX - 2, y: posY - 22 },
          end: { x: posX + 78, y: posY - 22 },
          thickness: 0.5,
          color: rgb(0.8, 0.8, 0.8),
        });
  
        // Draw text with bold font for header row
        page.drawText(cellValue, {
          x: posX,
          y: posY,
          font,
          size: rowIndex === 1 ? 12 : 10,
          color: rowIndex === 1 ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
        });
      });
  
      posY -= 20;
  
      if (rowIndex % 35 === 0 && rowIndex !== worksheet.rowCount) {
        pageNumber++;
        posY = 750;
      }
    });
  
    const pdfBytes = await pdfDoc.save();
    const outputFile = path.join(outputPath, `output-${Date.now()}.pdf`);
    fs.writeFileSync(outputFile, pdfBytes);
  
    return outputFile;
  };
  
  

module.exports = {
  convertXlsxToPdf,
};
