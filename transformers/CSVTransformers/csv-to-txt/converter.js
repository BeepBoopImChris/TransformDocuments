const { parse } = require("papaparse");
const { InvalidFileTypeError } = require("./customErrors");
const fs = require("fs");
const path = require("path");

async function convertCsvToTxt(csvBuffer) {
  try {
    const csvString = csvBuffer.toString("utf8");
    const { data } = await parse(csvString, { header: true });

    const headerColumns = Object.keys(data[0]);
    const numberOfRows = data.length;

    let txtString = headerColumns.join("\t") + "\n";

    for (let i = 0; i < numberOfRows; i++) {
      const rowValues = headerColumns.map((column) => data[i][column]);
      txtString += rowValues.join("\t") + "\n";
    }

    const outputPath = path.join(__dirname, '..', '..', '..', 'output');
    const outputFilename = `output-${Date.now()}.txt`;
    const outputPathFile = path.join(outputPath, outputFilename);

    fs.writeFileSync(outputPathFile, txtString);

    return outputPathFile;
  } catch (error) {
    throw new InvalidFileTypeError("An error occurred during the file conversion.");
  }
}

module.exports = {
  convertCsvToTxt,
};
