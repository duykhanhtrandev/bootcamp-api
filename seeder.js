const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

// Load models
const Bootcamp = require("./models/bootcampModel");
const Course = require("./models/courseModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModel");

// Connect to database
mongoose.connect(
  process.env.MONGO_URI.replace("<password>", process.env.DATABASE_PASSWORD)
);

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`./_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(fs.readFileSync(`./_data/courses.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`./_data/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`./_data/reviews.json`, "utf-8"));

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
