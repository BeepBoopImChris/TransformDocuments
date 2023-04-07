const { simpleParser: parse } = require("mailparser");
const validator = require("validator");
const cheerio = require("cheerio");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");

const { ValidationError, FormattingError } = require("./customErrors");

async function parseEml(emlBuffer) {
  if (!emlBuffer || !(emlBuffer instanceof Buffer)) {
    throw new ValidationError("emlBuffer must be a non-empty buffer");
  }

  try {
    const mail = await parse(emlBuffer);

    const content = mail.html || mail.textAsHtml || mail.text;
    let subject = mail.subject || "Email";

    subject = validator.escape(subject);

    return { content, subject };
  } catch (error) {
    throw new ValidationError(`Error while parsing EML: ${error.message}`);
  }
}

function formatEmailContent(content) {
  try {
    const $ = cheerio.load(content);

    $("img").css("max-width", "100%");

    $("body").css({
      "font-family": "Arial, sans-serif",
      "font-size": "14px",
      "line-height": "1.5",
      "color": "#333",
      "margin": "0",
      "padding": "0",
    });

    $("h1, h2, h3, h4, h5, h6").css("font-weight", "bold");

    $("a").css({
      "color": "#1a0dab",
      "text-decoration": "none",
    });

    $("a:hover").css("text-decoration", "underline");

    const formattedContent = `
    <div style="max-width: 612px; width: 100%; margin: 0 auto; padding: 20px; background-color: #ffffff; overflow-wrap: break-word;">
      ${$.html()}
    </div>
  `;

    return formattedContent;
  } catch (error) {
    throw new FormattingError();
  }
}

async function convertEmlToPdf(emlBuffer) {
  const { content, subject } = await parseEml(emlBuffer);
  const formattedContent = formatEmailContent(content);

  return new Promise((resolve, reject) => {
    pdf.create(formattedContent).toBuffer(async (err, buffer) => {
      if (err) {
        reject(new Error("Error while converting EML to PDF: " + err.message));
      } else {
        const outputPath = path.join(__dirname, '..', '..', '..', 'output');
        const outputFileName = `${subject}-${Date.now()}.pdf`;
        const outputFile = path.join(outputPath, outputFileName);

        await fs.promises.writeFile(outputFile, buffer);
        resolve(outputFile);
      }
    });
  });
}

module.exports = { convertEmlToPdf };
