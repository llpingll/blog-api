const mongoose = require("mongoose");

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Get the database connection string
const DB = process.env.DATABASE_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Connected to database");
  } catch (error) {
    console.log("Failed to connect to database");
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectToDB;
