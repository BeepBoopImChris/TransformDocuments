const { createCanvas } = require("canvas");

function generateImageFromSheet(sheetData) {

  const cellWidth = 100;
  const cellHeight = 25;
  const canvasWidth = cellWidth * (sheetData[0].length);
  const canvasHeight = cellHeight * (sheetData.length);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";

  for (let i = 0; i < sheetData.length; i++) {
    for (let j = 0; j < sheetData[i].length; j++) {
      ctx.fillText(sheetData[i][j], j * cellWidth + 10, i * cellHeight + 20);
    }
  }

  return canvas;
}

module.exports = { generateImageFromSheet };
