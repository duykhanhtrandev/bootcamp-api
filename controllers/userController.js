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

module.exports = {
  getCurrentUser,
};
