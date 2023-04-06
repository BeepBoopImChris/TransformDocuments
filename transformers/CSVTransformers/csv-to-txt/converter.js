const { parse } = require("papaparse");
const { InvalidFileTypeError } = require("./customErrors");

// Async function to convert CSV to TXT (TSV format)
async function convertCsvToTxt(csvBuffer) {
  try {
    // Convert the CSV buffer to a UTF-8 encoded string
    const csvString = csvBuffer.toString("utf8");

    // Parse the CSV string into an object
    const { data } = await parse(csvString, { header: true });

    // Extract header columns and the number of rows
    const headerColumns = Object.keys(data[0]);
    const numberOfRows = data.length;

    // Generate the header row for the TXT (TSV) file
    let txtString = headerColumns.join("\t") + "\n";

    // Iterate through the rows and generate the TXT (TSV) content
    for (let i = 0; i < numberOfRows; i++) {
      const rowValues = headerColumns.map((column) => data[i][column]);
      txtString += rowValues.join("\t") + "\n";
    }

    // Return the TXT (TSV) content as a buffer
    return Buffer.from(txtString, "utf8");
  } catch (error) {
    // Throw a custom error if the conversion fails
    throw new InvalidFileTypeError("An error occurred during the file conversion.");
  }
}

module.exports = {
  convertCsvToTxt,
};