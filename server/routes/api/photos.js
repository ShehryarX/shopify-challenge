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
  (req, res) => {
    // photo ids from body
    const { photoIds } = req.body;

    let succeededIds = [];
    let failedIds = [];

    // return type
    class PhotoResponse {
      constructor(id, succeeded, message) {
        this.id = id;
        this.message =  message || (succeeded ? "Deletion succeeded" : "Deletion failed")
      }

      toString() {
        return {id, message }
      }
    }

    // create array of promises
    const promises = photoIds.map(async photoId => {
      return new Promise(async (resolve, _reject) => {
        try {
          // find photo and delete
          const photo = await Photo.find({ id: photoId, user: req.user.id })
          if (photo) {
            await photo.delete();
            succeededIds.push(new PhotoResponse(photoId, true));
          } else {
            failedIds.push(new PhotoResponse(photoId, false, "Photo not found"));
          }
        } catch (e) {
          console.error(e);
          failedIds.push(new PhotoResponse(photoId, false));
        }
        resolve();
      })
    });

    // wait until all photos are deleted
    await Promise.all(promises);

    // return deletion status
    return res.json({ succeededIds, failedIds});
  }
);

/**
 * @route   POST api/photos/all
 * @desc    Returns list of all image URLs associated to a user account
 * @access  Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // fetch all photos, ordered by date
    Photo.find({ user: req.user.id })
      .sort({ date: -1 })
      .then(photos => res.json(photos))
      .catch(err => res.status(404).message("Unable to retrieve photos"));
  }
);

module.exports = router;
