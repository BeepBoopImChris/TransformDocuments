const ExcelJS = require('exceljs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '../../../output');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const convertXlsxToPdf = async (buffer, fontColor = '0,0,0') => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 600;
  const pageHeight = 800;

  const worksheet = workbook.getWorksheet(1);
  let pageNumber = 1;

  let columnWidths = [];
  let rowHeights = [];

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      const textWidth = font.widthOfTextAtSize(cellValue, 10);
      const cellWidth = Math.max(textWidth + 20, columnWidths[colNumber - 1] || 0);
      const cellHeight = row.height || 20;
      columnWidths[colNumber - 1] = cellWidth;
      rowHeights[row.number - 1] = cellHeight;
    });
  });

  const rowCount = worksheet.rowCount;
  const marginY = 50;
  let posY = pageHeight - marginY;

  const marginLeft = 20;

  let tableWidth = columnWidths.reduce((acc, cur) => acc + cur, 0);

  worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    const page = pdfDoc.getPages()[pageNumber - 1] || pdfDoc.addPage([pageWidth, pageHeight]);
    let posX = marginLeft;

    posY -= rowHeights[rowIndex - 1];

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      const cellWidth = columnWidths[colNumber - 1];
      const cellHeight = rowHeights[rowIndex - 1];
      const fontSize = rowIndex === 1 ? 12 : 10;
      const textColor = rowIndex === 1 ? rgb(...fontColor.split(',').map(Number)) : rgb(0, 0, 0);

      const isHeader = rowIndex === 1;
      const isEvenRow = rowIndex % 2 === 0;

      if (isHeader) {
        page.drawRectangle({
          x: posX,
          y: posY,
          width: cellWidth,
          height: cellHeight,
          color: rgb(0.2, 0.2, 0.2),
          borderRadius: 5,
        });
      } else if (isEvenRow) {
        page.drawRectangle({
          x: posX,
          y: posY,
          width: cellWidth,
          height: cellHeight,
          color: rgb(0.95, 0.95, 0.95),
          borderRadius: 5,
        });
      }

      page.drawText(cellValue, {
        x: posX + 8, // Add padding to the left of the text
        y: posY + (cellHeight - fontSize) / 2, // Center text vertically in the cell
        font: rowIndex === 1 ? fontBold : font,
        size: fontSize,
        color: textColor,
      });

      posX += cellWidth;
    });

    if (posY - rowHeights[rowIndex] < marginY) {
      pageNumber++;
      posY = pageHeight - marginY;
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
