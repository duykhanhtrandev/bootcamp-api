const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.route("/").get(getCourses).post(createCourse);
router.route("/:courseId").get(getSingleCourse).delete(deleteCourse);

module.exports = router;
