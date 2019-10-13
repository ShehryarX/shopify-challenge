const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @typedef             Photo
 * @property {string}   user is the user a photo belongs to
 * @property {string}   name.required is the filename of the image
 * @property {string}   url.required is the url of where the image is stored
 * @property {string}   date is an auto-generated timestamp
 */
const PhotoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {
  Photo: mongoose.model("photo", PhotoSchema)
};
