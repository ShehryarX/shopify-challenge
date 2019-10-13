const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cloudinary = require("cloudinary");

// router imports
const users = require("./routes/api/users");
const photos = require("./routes/api/photos");

// setup express
const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);

// configure and connect to mongodb
const db = require("./config/keys").mongoURL;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// configure cloudinary
const { apiKey, apiSecret } = require("./config/keys").cloudinaryConfig;
cloudinary.config({
  cloud_name: "dmvxreauf",
  api_key: apiKey,
  api_secret: apiSecret
});

// setup routes
app.use("/api/users", users);
app.use("/api/photos", photos);

// for further use
app.get("/", (req, res) => res.json("static homepage"));

// inititialize port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));

// export for testing purposes
module.exports = app;
