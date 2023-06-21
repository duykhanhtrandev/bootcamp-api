const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const BootCamp = require("../models/bootcampModel");

const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootCamp.find().sort("-createdAt");
    res
      .status(StatusCodes.OK)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

const getSingleBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const deleteBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
