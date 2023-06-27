const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const { StatusCodes } = require("http-status-codes");
const Course = require("../models/courseModel.js");
const Bootcamp = require("../models/bootcampModel.js");

const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query.sort("-createdAt");

  res.status(StatusCodes.OK).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

const getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.courseId }).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        StatusCodes.NOT_FOUND
      )
    );
  }
  res.status(StatusCodes.OK).json({
    success: true,
    data: course,
  });
});

const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findOne({ _id: req.params.bootcampId });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: course });
});

const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findOneAndUpdate(
    { _id: req.params.courseId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of: ${req.params.courseId}`,
        404
      )
    );
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: course,
  });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.courseId });
  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        StatusCodes.NOT_FOUND
      )
    );
  }
  await course.deleteOne();
  res.status(StatusCodes.OK).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
