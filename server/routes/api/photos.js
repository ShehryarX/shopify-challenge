const express = require("express");
const router = express.Router();
const passport = require("passport");

// schemas
const { Photo } = require("../../models/Photo");

// image upload utilities
const {
  cloudinaryUpload,
  cloudinaryDelete
} = require("../../providers/image/cloudinary");
const { multerUpload } = require("../../providers/image/multer");

/**
 * @route   GET api/photos/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ message: "Photos works" }));

/**
 * @route   POST api/photos/upload
 * @desc    Uploads photo to cloud and associates with user
 * @access  Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  multerUpload.any(),
  (req, res) => {
    const { user } = req;
    const { name } = req.body;
    const { path } = req.files[0];

    // find image
    Photo.find({ name }).then(images => {
      // duplicate image found
      if (images.length > 1) {
        return res.json("Image already exists");
      }
      // upload image to cloudinary
      cloudinaryUpload(path)
        .then(async result => {
          // save on database
          const photo = new Photo({
            name,
            user: user.id,
            url: result.url
          });

          try {
            await photo.save();
            return res.json(photo);
          } catch (e) {
            console.error(e);
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
);

/**
 * @route   DELETE api/photos/delete
 * @desc    Deletes list of image IDs associated to a user account
 * @access  Private
 */
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.body;

    try {
      // find photo that belongs to this user
      const photo = Photo.find({ _id: id, user: req.user.id });
      if (!photo) {
        return res.status(404).json("Failed to find photo");
      }

      // delete the photo
      await photo.remove();
      cloudinaryDelete(id);
      return res.json("Successfully deleted photo");
    } catch (e) {
      console.log(e);
      return res.json(e);
    }
  }
);

/**
 * @route   POST api/photos/all
 * @desc    Returns list of all image URLs associated to a user account, searchable
 *          by given text
 * @access  Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { name } = req.query;

    // fetch all photos, ordered by date
    Photo.find({
      user: req.user.id,
      name: {
        $regex: name || "",
        $options: "i"
      }
    })
      .sort({ date: -1 })
      .then(photos => res.json(photos))
      .catch(err => res.status(404).message("Unable to retrieve photos"));
  }
);

module.exports = router;
