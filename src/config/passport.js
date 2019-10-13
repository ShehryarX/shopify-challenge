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
const strategy = passport => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        done(null, user || false);
      } catch (err) {
        console.error(err);
      }
    })
  );
};

module.exports = strategy;
