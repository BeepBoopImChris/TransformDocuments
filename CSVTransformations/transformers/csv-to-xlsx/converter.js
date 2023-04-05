const csvtojson = require("csvtojson");
const XLSX = require("xlsx");
const { InvalidFileTypeError } = require("./customErrors");

// Async function to convert CSV to XLSX
async function convertCsvToXlsx(csvBuffer) {
  try {
    // Parse CSV data and convert it to JSON
    const jsonData = await csvtojson().fromString(csvBuffer.toString());

    // Create a new XLSX worksheet from the JSON data
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    // Create a new XLSX workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a buffer and return it
    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
  } catch (error) {
    // Throw a custom error if the conversion fails
    throw new InvalidFileTypeError("An error occurred during the file conversion.");
  }
}

module.exports = {
  convertCsvToXlsx,
};
