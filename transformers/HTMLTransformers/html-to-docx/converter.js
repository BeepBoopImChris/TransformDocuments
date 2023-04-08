const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const htmlDocx = require("html-docx-js");
const Blob = require("blob");
const { execFile } = require("child_process");

const outputPath = path.join(__dirname, "../../../output");

async function convertHtmlToDocx(htmlBuffer) {
    const inputFile = path.join(outputPath, `${Date.now()}.html`);
    const outputFile = path.join(outputPath, `${Date.now()}.docx`);
  
    fs.writeFileSync(inputFile, htmlBuffer);
  
    return new Promise((resolve, reject) => {
      execFile("pandoc", [inputFile, "-s", "-o", outputFile], (error) => {
        fs.unlinkSync(inputFile);
  
        if (error) {
          reject(error);
        } else {
          resolve(outputFile);
        }
      });
    });
  }

function blobToBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(Buffer.from(reader.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

module.exports = {
  convertHtmlToDocx,
};
