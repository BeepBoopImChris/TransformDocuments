const { simpleParser: parse } = require('mailparser');
const { ValidationError } = require('./errorHandler');
const validator = require('validator');

async function parseEml(emlBuffer) {
  if (!emlBuffer || !(emlBuffer instanceof Buffer)) {
    throw new ValidationError('emlBuffer must be a non-empty buffer');
  }

  try {
    const mail = await parse(emlBuffer);

    const content = mail.html || mail.textAsHtml || mail.text;
    let subject = mail.subject || 'Email';

    // Sanitize the subject
    subject = validator.escape(subject);

    return { content, subject };
  } catch (error) {
    throw new ValidationError(`Error while parsing EML: ${error.message}`);
  }
}

module.exports = parseEml;
