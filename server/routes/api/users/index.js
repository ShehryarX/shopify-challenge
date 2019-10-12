const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// schemas
const User = require("../../../models/User").User;

/**
 * @route   GET api/users/test
 * @desc    Tests users route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ message: "Users works" }));

/**
 * @route   GET api/users/register
   @desc    Register user
   @access  Public
 */
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    // no duplicate users
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
          newUser.save();
          return res.json(newUser);
        } catch (err) {
          console.log(err);
        }
      });
    });
  });
});

module.exports = router;
