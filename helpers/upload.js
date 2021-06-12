const multer = require("multer"); // middleware, used when loading files to handle multipart/form-data

require("dotenv").config();

const UPLOAD_DIR = process.env.UPLOAD_DIR;

// creates storage (destination - specifies the directory, where to save the file; filename - specifies the file name)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`); // changes the original file name
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // max file size 2Мб
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.includes("image")) {
      const error = new Error("Only images are allowed to be uploaded");
      error.status = 400;
      cb(error);

      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
