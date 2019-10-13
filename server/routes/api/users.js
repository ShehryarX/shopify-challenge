const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");

// schemas
const { User } = require("../../models/User");

// validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

/**
 * Tests that the user endpoints work
 * @route               GET api/users/test
 * @group               Public
 * @returns {string}    Returns message with expected behaviour
 */
router.get("/test", (req, res) => res.json({ message: "Users works" }));

/**
 * Registers a user
 * @route               POST api/users/register
 * @group               Public
 * @param {string}      name.body.required
 * @param {string}      email.body.required
 * @param {string}      password.body.required
 * @param {string}      password2.body.required
 * @returns {User}      Returns newly created user object
 */
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password } = req.body;

  User.findOne({ email }).then(user => {
    // email already there
    if (user) {
      errors.email = "Email already exists";
      return res.status(409).json(errors);
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

        // hash password and save
        try {
          newUser.password = hash;
          await newUser.save();
          return res.json(newUser);
        } catch (err) {
          return res.sendStatus(500);
        }
      });
    });
  });
});

/**
 * Logs in user and returns corresponding JWT token
 * @route               POST api/users/login
 * @group               Public
 * @param {string}      email.body.required
 * @param {string}      password.body.required
 * @returns {string}    Returns personally signed JWT expiring in 24 hours
 */
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

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
        return res.status(401).json(errors);
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
 * Returns information for current user
 * @route               GET api/users/current
 * @group               Private
 * @security            JWT
 * @returns {User}      Returns associated user object
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
