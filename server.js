const express = require("express");
const app = express();
const csvToPdf = require("./routes/CSVRoutes/csv-to-pdf");
const csvToTxt = require("./routes/CSVRoutes/csv-to-txt");
const emlToPdf = require("./routes/EMLRoutes/eml-to-pdf");
const errorHandler = require("./middleware/errorHandling");

app.use(express.json());

app.use("/csv-to-pdf", csvToPdf);
app.use("/csv-to-txt", csvToTxt);
app.use("/eml-to-pdf", emlToPdf);





app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});