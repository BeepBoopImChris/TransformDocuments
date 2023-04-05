const express = require("express");
const app = express();
const csvToXlsx = require("./routes/csv-to-xlsx");
const csvToPdf = require("./routes/csv-to-pdf");
const csvToTxt = require("./routes/csv-to-txt");
const errorHandler = require("./middleware/error-handling");

app.use(express.json());

app.use("/csv-to-xlsx", csvToXlsx);
app.use("/csv-to-pdf", csvToPdf);
app.use("/csv-to-txt", csvToTxt);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
