const multer = require("multer");

const storage = multer.memoryStorage();
const limits = { fileSize: 5 * 1024 * 1024 };
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/html") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only HTML files are allowed."), false);
  }
};

const htmlUpload = multer({ storage, limits, fileFilter });

module.exports = htmlUpload;
