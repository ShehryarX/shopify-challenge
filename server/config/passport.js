const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const User = mongoose.model("user");
const keys = require("./keys");

// passport configuration
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

/**
 * User validation strategy.
 *
 * Returns true in second done argument if user is authenticated,
 * otherwise false.
 */
const strategy = async passport => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      try {
        const user = User.findById(jwt_payload.id);
        done(null, user || false);
      } catch (e) {
        console.error(e);
      }
    })
  );
};

module.exports = strategy;
