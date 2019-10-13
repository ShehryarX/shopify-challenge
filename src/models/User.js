const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @typedef             User
 * @property {string}   name.required is the full name of the user
 * @property {string}   email.required is the email of the user
 * @property {string}   password.required is the password of the user
 * @property {string}   date is an auto-generated timestamp
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {
  User: mongoose.model("user", UserSchema)
};
