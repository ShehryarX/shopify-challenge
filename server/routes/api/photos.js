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

module.exports = router;
