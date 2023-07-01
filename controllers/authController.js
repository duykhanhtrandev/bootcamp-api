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

  // Create token
  const token = user.getSignedJwtToken();

  res.status(StatusCodes.OK).json({ success: true, token });
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

  // Create token
  const token = user.getSignedJwtToken();

  res.status(StatusCodes.OK).json({ success: true, token });
});

module.exports = {
  register,
  login,
};
