const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

// Path for saving the output file
const outputPath = path.join(__dirname, '..', '..', '..', 'output');

// Function to convert XLSX file to CSV file
const convertXlsxToCsv = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(1);
  let csvData = '';

  // Iterate over each row of worksheet
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    // Convert row data to CSV format
    const rowData = row.values.slice(1).map((cell) => `"${cell ? cell.toString().replace(/"/g, '""') : ''}"`).join(',');
    csvData += `${rowData}\r\n`;
  });

  // Write the CSV data to file
  const outputFile = path.join(outputPath, `output-${Date.now()}.csv`);
  fs.writeFileSync(outputFile, csvData);

  // Return the path of output file
  return outputFile;
};

module.exports = {
  convertXlsxToCsv,
};
