const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/bootcampModel");

const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: bootcamp,
  });
});

const getAllBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // Copy req.query
  let reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate({ path: "courses" });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(StatusCodes.OK).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

const getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
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
  const bootcamp = await Bootcamp.findOne({ _id: req.params.id });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }
  await bootcamp.deleteOne();
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
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findOne({ _id: req.params.id });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  if (!req.files) {
    new next(
      new ErrorResponse(`Please upload a file`, StatusCodes.BAD_REQUEST)
    );
  }

  const { file } = req.files;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    new next(
      new ErrorResponse(`Please upload an image file`, StatusCodes.BAD_REQUEST)
    );
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    new next(
      new ErrorResponse(
        `Please upload an image smaller than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        }MB`,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  const imagePath = `${process.env.FILE_UPLOAD_PATH}/${file.name}`;

  file.mv(imagePath, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(
          `Problem with file upload`,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }

    await Bootcamp.findOneAndUpdate(
      { _id: req.params.id },
      { photo: file.name }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: file.name,
    });
  });
});

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
};
