const cloudinary = require("cloudinary");

const cloudinaryUpload = file => {
  return new Promise((resolve, reject) => {
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
