const multer = require("multer");

const storage = multer.memoryStorage();
const limits = { fileSize: 5 * 1024 * 1024 }; // Limit file size to 5 MB
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only CSV files are allowed."), false);
  }
};

const csvUpload = multer({ storage, limits, fileFilter });

module.exports = csvUpload;