const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const User = require("./models/user");

// Configure the JWT strategy
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET_TOKEN, // Can be a private or public key depending on algorithim
      // algorithms: ["RS256"], // if RS256 specify explicitly elseif HS256 you could omit
    },
    async (payload, done) => {
      try {
        // Check if user exists
        const user = await User.findById(payload.id).exec();
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
