const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const { StatusCodes } = require("http-status-codes");
const Course = require("../models/courseModel.js");

const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  res.status(StatusCodes.OK).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

module.exports = {
  getCourses,
};
