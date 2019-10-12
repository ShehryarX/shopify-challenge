const cloudinary = require("cloudinary");

/**
 * Takes in a file and uploads it to Cloudinary
 */
const cloudinaryUpload = file => {
  return new Promise((resolve, reject) => {
    // uploades appropriate file
    cloudinary.uploader.upload(
      file,
      result => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: "auto" }
    );
  });
};

/**
 * Takes in a file id and destroys its instance on Cloudinary
 */
const cloudinaryDelete = id => {
  return new Promise((resolve, _reject) => {
    try {
      cloudinary.uploader.destroy(id).then(() => {
        resolve();
      });
    } catch (e) {
      resolve(e);
    }
  });
};

module.exports = {
  cloudinaryUpload,
  cloudinaryDelete
};
