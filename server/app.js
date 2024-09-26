const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { passport } = require("./auth"); // Import the configured Passport instance
const cors = require("cors");
const createError = require("http-errors");

const indexRouter = require("./routes/index");

const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS
app.use(cors());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ errors: [{ msg: err.message || "Internal Server Error" }] });
});

module.exports = app;
