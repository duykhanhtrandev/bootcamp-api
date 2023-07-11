const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const Review = require("../models/reviewModel");
const Bootcamp = require("../models/bootcampModel");

const getAllReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(StatusCodes.OK).json({
      success: true,
      length: reviews.length,
      data: reviews,
    });
  } else {
    return res.status(StatusCodes.OK).json(res.advancedResults);
  }
});

const getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ _id: req.params.id });

  if (!review) {
    return next(
      new ErrorResponse(
        `Review not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: review,
  });
});

const createReview = asyncHandler(async (req, res, next) => {
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

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: review,
  });
});

module.exports = { getAllReviews, getSingleReview, createReview };
