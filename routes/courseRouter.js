const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courseController");

const Course = require("../models/courseModel");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllCourses
  )
  .post(createCourse);

router
  .route("/:courseId")
  .get(getSingleCourse)
  .patch(updateCourse)
  .delete(deleteCourse);

module.exports = router;
