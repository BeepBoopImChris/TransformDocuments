const puppeteer = require("puppeteer");
async function htmlToPDF(html, browserWSEndpoint) {
    const browser = await puppeteer.connect({ browserWSEndpoint });
    const page = await browser.newPage();
  
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4" });
  
    await page.close();
    
    return pdf;
  }
  module.exports = htmlToPDF;
