const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/bootcampModel");

const createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: bootcamp,
  });
});

const getAllBootcamps = asyncHandler(async (req, res, next) => {
  res.status(StatusCodes.OK).json(res.advancedResults);
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
  const bootcamp = await Bootcamp.findOne({ _id: req.params.id });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  await bootcamp.updateOne(req.body, {
    new: true,
    runValidators: true,
  });

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

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        StatusCodes.UNAUTHORIZED
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

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        StatusCodes.UNAUTHORIZED
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
