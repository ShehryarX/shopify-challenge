const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String,
    required: true
  },
  path: {
    type: String
  },
  tags: {
    type: Array[String]
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("photo", PhotoSchema);
