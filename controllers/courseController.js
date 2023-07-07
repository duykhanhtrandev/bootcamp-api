const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const { StatusCodes } = require("http-status-codes");
const Course = require("../models/courseModel.js");
const Bootcamp = require("../models/bootcampModel.js");

const getAllCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(StatusCodes.OK).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    return res.status(StatusCodes.OK).json(res.advancedResults);
  }
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
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findOne({ _id: req.params.bootcampId });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.bootcampId}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: course });
});

const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.courseId });

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of: ${req.params.courseId}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  await course.updateOne(req.body, {
    new: true,
    runValidators: true,
  });

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

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        StatusCodes.UNAUTHORIZED
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
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
