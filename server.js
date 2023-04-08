// Require Express and create an instance of the app
const express = require("express");
const app = express();

// Import various route handlers
const csvToPdf = require("./routes/CSVRoutes/csv-to-pdf");
const csvToTxt = require("./routes/CSVRoutes/csv-to-txt");
const emlToPdf = require("./routes/EMLRoutes/eml-to-pdf");
const xlsxToPdf = require("./routes/XLSXRoutes/xlsx-to-pdf");
const xlsxToCsv = require("./routes/XLSXRoutes/xlsx-to-csv");
const htmlToPdf = require("./routes/HTMLRoutes/html-to-pdf");
const htmlToDocx = require("./routes/HTMLRoutes/html-to-docx");



// Import the error handler middleware
const errorHandler = require("./middleware/errorHandling");

// Add middleware to parse incoming JSON data
app.use(express.json());

// Set up various routes and associated handlers

// For CSV
app.use("/csv-to-pdf", csvToPdf);
app.use("/csv-to-txt", csvToTxt);

// For EML
app.use("/eml-to-pdf", emlToPdf);

// For XLSX
app.use("/xlsx-to-pdf", xlsxToPdf);
app.use("/xlsx-to-csv", xlsxToCsv);

// For HTML
app.use("/html-to-pdf", htmlToPdf);
app.use("/html-to-docx", htmlToDocx);


// Add the error handling middleware to the app
app.use(errorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
