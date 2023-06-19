const { StatusCodes } = require("http-status-codes");
const BootCamp = require("../models/bootcampModel");

const createBootcamp = async (req, res) => {
  try {
    const bootcamp = await BootCamp.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false });
  }
};

const getAllBootcamps = async (req, res) => {
  try {
    const bootcamps = await BootCamp.find().sort("-createdAt");
    res
      .status(StatusCodes.OK)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ success: false });
  }
};

const getSingleBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false });
    }
    res.status(StatusCodes.OK).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(StatusCodes.BAD_REQUEST).json({ success: false });
    next(error);
  }
};

const updateBootcamp = async (req, res) => {
  try {
    const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false });
    }
    res.status(StatusCodes.OK).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false });
  }
};

const deleteBootcamp = async (req, res) => {
  try {
    const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false });
    }
    res.status(StatusCodes.OK).json({ success: true, data: {} });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false });
  }
};

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
