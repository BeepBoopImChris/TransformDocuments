const express = require("express");
const app = express();
const csvToPdf = require("./routes/CSVRoutes/csv-to-pdf");
const csvToTxt = require("./routes/CSVRoutes/csv-to-txt");
const emlToPdf = require("./routes/EMLRoutes/eml-to-pdf");
const xlsxToPdf = require("./routes/XLSXRoutes/xlsx-to-pdf");
const xlsxToCsv = require("./routes/XLSXRoutes/xlsx-to-csv");
const xlsxToJpg = require("./routes/XLSXRoutes/xlsx-to-jpg");

const errorHandler = require("./middleware/errorHandling");

app.use(express.json());

//CSV 
app.use("/csv-to-pdf", csvToPdf);
app.use("/csv-to-txt", csvToTxt);

//EML
app.use("/eml-to-pdf", emlToPdf);

//XLSX
app.use("/xlsx-to-pdf", xlsxToPdf);
app.use("/xlsx-to-csv", xlsxToCsv);
app.use("/xlsx-to-jpg", xlsxToJpg);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});