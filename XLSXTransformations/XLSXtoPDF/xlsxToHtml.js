const exceljs = require("exceljs");

async function workbookToHTML(workbook, fontStyle) {
    let html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid black;
        padding: 5px;
        text-align: left;
        vertical-align: top;
        font-family: ${fontStyle};
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
    </style>
  </head>
  <body>`;
  
    for (const worksheet of workbook.worksheets) {
      html += `<h3>${worksheet.name}</h3>`;
      html += "<table>";
  
      // Render header row
      html += "<tr>";
      for (const cell of worksheet.getRow(1).values.slice(1)) {
        html += `<th style="font-family:${fontStyle};">${cell}</th>`;
      }
      html += "</tr>";
  
      // Render data rows
      for (const row of worksheet.getRows(2, worksheet.rowCount)) {
        html += "<tr>";
        for (const cell of row.values.slice(1)) {
          html += `<td style="font-family:${fontStyle};">${cell}</td>`;
        }
        html += "</tr>";
      }
  
      html += "</table>";
    }
  
    html += "</body></html>";
  
    return html;
  }
  module.exports = workbookToHTML;
