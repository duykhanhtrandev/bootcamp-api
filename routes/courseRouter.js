const express = require("express");
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

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
  .post(protect, authorize("publisher", "admin"), createCourse);

router
  .route("/:courseId")
  .get(getSingleCourse)
  .patch(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
