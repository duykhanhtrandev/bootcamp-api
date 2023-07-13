require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");

// connectDB
const connectDB = require("./db/connect");

// set static folder
app.use(express.static("./public"));

// file uploading
app.use(fileUpload());

// routers
const bootcampRouter = require("./routes/bootcampRouter");
const courseRouter = require("./routes/courseRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");

// middleware
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${port} (http://localhost:3000)`
          .yellow.bold
      );
    });
  } catch (error) {
    console.log(`${error}`.red);
  }
};

start();
