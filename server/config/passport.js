const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const User = mongoose.model("user");
const keys = require("./keys");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      try {
        const user = User.findById(jwt_payload.id);
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (e) {
        console.error(e);
      }
    })
  );
};
