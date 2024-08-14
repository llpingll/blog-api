const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const User = require("./models/user");

// Configure the JWT strategy
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET_TOKEN,
    },
    async (payload, done) => {
      try {
        // Check if user exists
        const user = User.findById(payload.sub);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false, { message: "User not found" });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
