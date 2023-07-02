require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
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

// middleware
app.use(express.json());

// cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
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
