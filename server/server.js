const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// router imports
const users = require("./routes/api/users/");
const profiles = require("./routes/api/profiles/");
const posts = require("./routes/api/photos/");

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);

// configure and connect to mongodb
const db = require("./config/keys").mongoURL;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// setup routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/photos", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));
