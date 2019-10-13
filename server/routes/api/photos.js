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
 * Tests the photos route
 * @route               GET api/photos/test
 * @group               Public
 * @returns {string}    Returns message with expected behaviour
 */
router.get("/test", (req, res) => res.json({ message: "Photos works" }));

/**
 * Uploads photo associated to user
 * @route               POST api/photos
 * @group               Private
 * @security            JWT
 * @param {string}      name.body.required is the filename with extension
 * @param {string}      path.files.required is the image
 * @returns {Photo}     Returns the saved photo object
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
        return res.status(400).json({ message: "Image already exists" });
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
            return res.sendStatus(500);
          }
        })
        .catch(err => {
          return res.sendStatus(500);
        });
    });
  }
);

/**
 * Deletes list of image IDs associated to a user accoun
 * @route               DELETE api/photos
 * @group               Private
 * @security            JWT
 * @param {string}      id.body.required is the id of the photo to be deleted
 * @returns {string}    Message that tells you that deletion has succeeded
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
        return res.status(404).json({ message: "Failed to find photo" });
      }

      // delete the photo
      await Photo.deleteOne({ _id: id, user: req.user.id });
      cloudinaryDelete(id);
      return res.json({ message: "Successfully deleted photo" });
    } catch (err) {
      return res.status(500);
    }
  }
);

/**
 * Returns list of all image URLs associated to a user account, searchable by given text
 * @route                       GET api/photos
 * @group                       Private
 * @security                    JWT
 * @param {string}              name.body.optional is the name you can search by, optionally
 * @returns {Array.<Photo>}     returns array of photo objects
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
