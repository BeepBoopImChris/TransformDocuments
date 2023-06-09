const multer = require("multer");

const storage = multer.memoryStorage();
const limits = { fileSize: 5 * 1024 * 1024 }; // Limit file size to 5 MB
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only XLSX files are allowed."), false);
  }
};

const xlsxUpload = multer({ storage, limits, fileFilter });

module.exports = xlsxUpload;
