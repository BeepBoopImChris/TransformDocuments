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
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  const pageWidth = 600;
  const pageHeight = 800;

  const worksheet = workbook.getWorksheet(1);
  let pageNumber = 1;

  let posY = 750;
  let columnWidths = [];

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      const textWidth = font.widthOfTextAtSize(cellValue, 10);
      const cellWidth = Math.max(textWidth + 10, columnWidths[colNumber - 1] || 0);
      columnWidths[colNumber - 1] = cellWidth;
    });
  });

  let totalColumnWidth = columnWidths.reduce((acc, cur) => acc + cur, 0);
  let columnsPerPage = Math.floor(pageWidth / (totalColumnWidth / columnWidths.length));
  let pagesPerRow = Math.ceil(columnWidths.length / columnsPerPage);

  const rowCount = worksheet.rowCount;
  const rowHeight = 20;
  const tableHeight = rowCount * rowHeight;
  const marginY = (pageHeight - tableHeight) / 2;
  posY = pageHeight - marginY - rowHeight;

  const drawVerticalLines = (page, startY, endY, x) => {
    page.drawLine({
      start: { x: x, y: startY },
      end: { x: x, y: endY },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  };

  const drawHorizontalLines = (page, startX, endX, y) => {
    for (let i = 0; i <= rowCount; i++) {
      page.drawLine({
        start: { x: startX, y: y - i * rowHeight },
        end: { x: endX, y: y - i * rowHeight },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
    }
  };

  worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    for (let pageOffset = 0; pageOffset < pagesPerRow; pageOffset++) {
      const page = pdfDoc.getPages()[pageNumber - 1 + pageOffset] || pdfDoc.addPage([pageWidth, pageHeight]);
      let posX = 0;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= columnsPerPage * pageOffset || colNumber > columnsPerPage * (pageOffset + 1)) {
          return;
        }

        const cellValue = cell.value ? cell.value.toString() : '';
        const cellWidth = columnWidths[colNumber - 1];
        const isBold = cell.font && cell.font.bold;
        const isItalic = cell.font && cell.font.italic;
        const isUnderline = cell.font && cell.font.underline;
        const fontSize = rowIndex === 1 ? 12 : 10;
        const textColor = rowIndex === 1 ? rgb(...fontColor.split(',').map(Number)) : rgb(0.2, 0.2, 0.2);

        let selectedFont = font;
        if (isBold && isItalic) {
          selectedFont = fontBoldItalic;
        } else if (isBold) {
          selectedFont = fontBold;
        } else if (isItalic) {
          selectedFont = fontItalic;
        }

        page.drawText(cellValue, {
          x: posX,
          y: posY,
          font: selectedFont,
          size: fontSize,
          color: textColor,
        });

        if (isUnderline) {
          const textWidth = selectedFont.widthOfTextAtSize(cellValue, fontSize);
          const underlineY = posY - fontSize * 0.15;
          page.drawLine({
            start: { x: posX, y: underlineY },
            end: { x: posX + textWidth, y: underlineY },
            thickness: fontSize * 0.08,
            color: textColor,
          });
        }

        posX += cellWidth;
      });

      const startX = 0;
      const endX = Math.min(totalColumnWidth, columnsPerPage * (pageOffset + 1) * columnWidths[0]);

      drawHorizontalLines(page, startX, endX, posY);

      // Draw vertical lines
      let posXForVerticalLines = 0;
      for (let colNumber = 1; colNumber <= columnsPerPage; colNumber++) {
        posXForVerticalLines += columnWidths[colNumber - 1];
        drawVerticalLines(page, posY, posY - tableHeight + marginY, posXForVerticalLines);
      }
    }

    posY -= rowHeight;

    if (rowIndex % 35 === 0 && rowIndex !== worksheet.rowCount) {
      pageNumber += pagesPerRow;
      posY = pageHeight - marginY - rowHeight;
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

