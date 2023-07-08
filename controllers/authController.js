const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, StatusCodes.OK, res);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorResponse(
        "Please provide email and password",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  // Check fot user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED)
    );
  }

  // Check if password matches
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(
      new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED)
    );
  }

  sendTokenResponse(user, StatusCodes.OK, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(
        `There is no user with this email ${req.body.email}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
};
