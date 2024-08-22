const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const User = require("./models/user");

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Custom middleware to check if user has admin rights
const ensureAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.type === "admin") {
    return next(); // User is authenticated and has admin rights
  } else {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

// Configure the JWT strategy
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET, // Can be a private or public key depending on algorithim
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

module.exports = { passport, ensureAdmin };
