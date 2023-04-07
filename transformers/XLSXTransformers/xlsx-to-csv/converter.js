const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, '..', '..', '..', 'output');

const convertXlsxToCsv = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(1);
  let csvData = '';

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    const rowData = row.values.slice(1).map((cell) => `"${cell ? cell.toString().replace(/"/g, '""') : ''}"`).join(',');
    csvData += `${rowData}\r\n`;
  });

  const outputFile = path.join(outputPath, `output-${Date.now()}.csv`);
  fs.writeFileSync(outputFile, csvData);

  return outputFile;
};

module.exports = {
  convertXlsxToCsv,
};
