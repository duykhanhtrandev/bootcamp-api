const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  // token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse(
        "Not authorized to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findOne({ _id: decoded.id });

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        "Not authorized to access this route",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          StatusCodes.FORBIDDEN
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
