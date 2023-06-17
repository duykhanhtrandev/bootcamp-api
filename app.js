require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const colors = require("colors");

// connectDB
const connectDB = require("./db/connect");

// routers
const bootcampRouter = require("./routes/bootcampRouter");

// middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcampRouter);
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
