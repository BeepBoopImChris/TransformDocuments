const multer = require("multer");

const storage = multer.memoryStorage();
const limits = { fileSize: 5 * 1024 * 1024 }; 
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "message/rfc822") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only EML files are allowed."), false);
  }
};

const emlUpload = multer({ storage, limits, fileFilter });

module.exports = emlUpload;
