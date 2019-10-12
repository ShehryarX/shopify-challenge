const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// schemas
const { Photo } = require("../../models/Photo");
const { User } = require("../../models/User");

/**
 * @route   GET api/photos/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ message: "Photos works" }));

/**
 * @route   POST api/photos/upload
 * @desc    Associates an array of uploaded photos to a user account
 * @access  Private
 */

/**
 * @route   POST api/photos/all
 * @desc    Returns list of all image URLs associated to a user account
 * @access  Private
 */
router.post("/all", (req, res) => {
  // fetch all photos, ordered by date

  // TODO: Is this how to retrieve multiple images?
  Photo.find({ user: req.user.id })
    .sort({ date: -1 })
    .then(photos => res.json(photos))
    .catch(err => res.status(404).message("Unable to retrieve photos"));
});

module.exports = router;
