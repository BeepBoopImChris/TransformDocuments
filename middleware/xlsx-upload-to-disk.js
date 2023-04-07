const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const xlsxUploadToDisk = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension !== ".xlsx") {
      return cb(new Error("Only XLSX files are allowed."), false);
    }
    cb(null, true);
  },
});

module.exports = xlsxUploadToDisk;
