const express = require("express");
const router = express.Router();
const passport = require("passport");

// schemas
const { Photo } = require("../../models/Photo");

// image upload utilities
const { cloudinaryUpload } = require("../../providers/image/cloudinary");
const { multerUpload } = require("../../providers/image/multer");

/**
 * @route   GET api/photos/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ message: "Photos works" }));

/**
 * @route   POST api/photos/upload
 * @desc    Uploads photo to cloud and associates with user.
 * @access  Private
 */
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  multerUpload.any(),
  (req, res) => {
    // create image detail object
    const imageDetails = {
      user: req.body.user.id,
      name: req.body.imageName
    };

    // find image
    Photo.find({ name: imageDetails.name }).then(images => {
      // duplicate image found
      if (images.length > 1) {
        return res.json("Image already exists");
      }

      // set path for upload
      imageDetails.path = req.files[0].path;

      // upload image to cloudinary
      cloudinaryUpload
        .upload(imageDetails.cloudImage)
        .then(result => {
          imageDetails.url = result.url;

          // store photo on database
          Photo.create(imageDetails, (err, created) => {
            if (err) {
              return res.status(500).json("Unable to upload image");
            } else {
              res.json({ message: "Successfully uploaded!" });
            }
          });
        })
        .catch(err => {
          return res
            .status(500)
            .json({ err, message: "Problem uploading image" });
        });
    });
  }
);

/**
 * @route   POST api/photos/all
 * @desc    Returns list of all image URLs associated to a user account
 * @access  Private
 */
router.post(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // TODO: Is this how to retrieve multiple images?
    // fetch all photos, ordered by date
    Photo.find({ user: req.body.user.id })
      .sort({ date: -1 })
      .then(photos => res.json(photos))
      .catch(err => res.status(404).message("Unable to retrieve photos"));
  }
);

module.exports = router;
