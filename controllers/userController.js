const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");

const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    return next(new ErrorResponse("Please login", StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(StatusCodes.OK).json(res.advancedResults);
});

const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return next(
      new ErrorResponse(
        `User not found with id of ${req.params.id}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  res.status(StatusCodes.OK).json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(StatusCodes.OK).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });

  res.status(StatusCodes.OK).json({ success: true, data: {} });
});

module.exports = {
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
