const cheerio = require('cheerio');
const { FormattingError } = require('./errorHandler');

function formatEmailContent(content) {
  try {
    const $ = cheerio.load(content);

    // Apply a max-width to all images to fit the page
    $('img').css('max-width', '100%');
    
    // Apply default styles to the body
    $('body').css({
      'font-family': 'Arial, sans-serif',
      'font-size': '14px',
      'line-height': '1.5',
      'color': '#333',
      'margin': '0',
      'padding': '0',
    });

    // Apply basic styles to headers
    $('h1, h2, h3, h4, h5, h6').css('font-weight', 'bold');

    // Apply basic styles to links
    $('a').css({
      'color': '#1a0dab',
      'text-decoration': 'none',
    });

    $('a:hover').css('text-decoration', 'underline');

    // Wrap the content in a centered container with padding and margins
    const formattedContent = `
      <div style="width: 100%; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        ${$.html()}
      </div>
    `;

    return formattedContent;
  } catch (error) {
    throw new FormattingError();
  }
}

module.exports = formatEmailContent;
