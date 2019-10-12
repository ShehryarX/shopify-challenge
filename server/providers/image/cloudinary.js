const cloudinary = require("cloudinary");

/**
 * Takes in a file and uploads it to Cloudinary.
 */
const cloudinaryUpload = file => {
  return new Promise((resolve, reject) => {
    // uploades appropriate file
    cloudinary.uploader(
      file,
      result => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: "auto" }
    );
  });
};

module.exports = {
  cloudinaryUpload
};
