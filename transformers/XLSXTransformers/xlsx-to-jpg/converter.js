const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

async function convertXlsxToJpg(inputFilePath, outputFolderPath, worksheetName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFilePath);
  const worksheet = workbook.getWorksheet(worksheetName);

  const maxColumn = worksheet.actualColumnCount;
  const maxRow = worksheet.actualRowCount;

  const cellWidth = 64;
  const cellHeight = 32;

  const canvasWidth = maxColumn * cellWidth;
  const canvasHeight = maxRow * cellHeight;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Draw the grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";

  for (let i = 0; i <= maxColumn; i++) {
    ctx.moveTo(i * cellWidth, 0);
    ctx.lineTo(i * cellWidth, canvasHeight);
    ctx.stroke();
  }

  for (let i = 0; i <= maxRow; i++) {
    ctx.moveTo(0, i * cellHeight);
    ctx.lineTo(canvasWidth, i * cellHeight);
    ctx.stroke();
  }

  // Write cell content
  ctx.font = "12px Arial";
  ctx.fillStyle = "black";
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      const value = cell.value ? cell.value.toString() : "";
      ctx.fillText(
        value,
        (colNumber - 1) * cellWidth + 2,
        rowNumber * cellHeight - cellHeight / 2 + 12
      ); // Added 12 to vertically align the text within the cell
    });
  });

  const outputFilePath = path.join(outputFolderPath, `${worksheetName}.jpg`);
  const out = fs.createWriteStream(outputFilePath);
  const stream = canvas.createJPEGStream();
  stream.pipe(out);
  out.on("finish", () => console.log(`Generated: ${outputFilePath}`));
}

module.exports = { convertXlsxToJpg };
