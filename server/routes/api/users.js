const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");

// schemas
const { User } = require("../../models/User");

/**
 * @route   GET api/users/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ message: "Users works" }));

/**
 * @route   POST api/users/register
   @desc    Registers user with passed in fields
   @access  Public
 */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const errors = {};

  User.findOne({ email }).then(user => {
    // email already there
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    // create new user
    const newUser = new User({
      name,
      email,
      password
    });

    // salt and hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          throw err;
        }
        try {
          newUser.password = hash;
          await newUser.save();
          return res.json(newUser);
        } catch (err) {
          console.log(err);
        }
      });
    });
  });
});

/**
 * @route   POST api/users/login
 * @desc    Logs in user and returns corresponding JWT token
 * @access  Public
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const errors = {};

  User.findOne({ email }).then(user => {
    // user isn't found
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatched => {
      // incorrect password
      if (!isMatched) {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }

      // user matched
      const { id, name, avatar } = user;
      const payload = { id, name, avatar }; // create JWT payload

      // sign and return token, expires in 24 hours
      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: "24h" },
        (err, token) => {
          return res.json({
            success: true,
            token: `Bearer ${token}`
          });
        }
      );
    });
  });
});

/**
 * @route   GET api/users/current
 * @desc    Return current user session
 * @access  Private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;

    return res.json({
      id,
      name,
      email
    });
  }
);

module.exports = router;
