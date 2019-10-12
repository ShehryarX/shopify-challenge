const multer = require("multer");

/**
 * Takes an arbitrary file, filters it for an image, and
 * stores it locally.
 */
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const supported = ["image/jpeg", "image/png"];
    const found = supported.find(file.mimetype);

    if (found) {
      cb(null, "./files/images/");
    } else {
      cb({ message: "Not image or video file" }, false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const multerUpload = multer({ storage: storage });

module.exports = {
  multerUpload
};
