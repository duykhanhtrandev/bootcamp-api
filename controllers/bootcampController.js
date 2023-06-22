const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const geocoder = require("../utils/geocoder");
const BootCamp = require("../models/bootcampModel");

const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: bootcamp,
  });
});

const getAllBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = JSON.parse(queryStr);
  const bootcamps = await BootCamp.find(query).sort("-createdAt");
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

const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378km
  const radius = distance / 3963;
  const bootcamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
};
