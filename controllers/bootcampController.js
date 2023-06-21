const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const BootCamp = require("../models/bootcampModel");

const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: bootcamp,
  });
});

const getAllBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootCamp.find().sort("-createdAt");
  res
    .status(StatusCodes.OK)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

const getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }
  res.status(StatusCodes.OK).json({ success: true, data: bootcamp });
});

const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }
  res.status(StatusCodes.OK).json({ success: true, data: bootcamp });
});

const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }
  res.status(StatusCodes.OK).json({ success: true, data: {} });
});

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
