// Import required packages and custom errors module
const { parse } = require("papaparse");
const { InvalidFileTypeError } = require("./customErrors");
const fs = require("fs");
const path = require("path");

// Function to convert CSV buffer to TXT file
async function convertCsvToTxt(csvBuffer) {
  try {
    // Parse CSV buffer to string and convert to object using PapaParse library
    const csvString = csvBuffer.toString("utf8");
    const { data } = await parse(csvString, { header: true });

    // Extract header columns and number of rows
    const headerColumns = Object.keys(data[0]);
    const numberOfRows = data.length;

    // Create a string with tab-separated header columns and rows
    let txtString = headerColumns.join("\t") + "\n";
    for (let i = 0; i < numberOfRows; i++) {
      const rowValues = headerColumns.map((column) => data[i][column]);
      txtString += rowValues.join("\t") + "\n";
    }

    // Set up output file path and write to file system
    const outputPath = path.join(__dirname, '..', '..', '..', 'output');
    const outputFilename = `output-${Date.now()}.txt`;
    const outputPathFile = path.join(outputPath, outputFilename);
    fs.writeFileSync(outputPathFile, txtString);

    return outputPathFile;
  } catch (error) {
    // Throw InvalidFileTypeError if there's an error during the conversion process
    throw new InvalidFileTypeError("An error occurred during the file conversion.");
  }
}

module.exports = {
  convertCsvToTxt,
};
