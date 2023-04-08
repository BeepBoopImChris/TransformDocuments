const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");

async function convertHtmlToPdf(htmlBuffer) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlBuffer.toString());

  const outputFilename = path.join(__dirname, "../../../output", `${uuidv4()}.pdf`);
  await page.pdf({ path: outputFilename, format: "A4" });

  await browser.close();
  return outputFilename;
}

module.exports = { convertHtmlToPdf };
