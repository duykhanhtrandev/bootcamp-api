require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");

// middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routers
const bootcampRouter = require("./routes/bootcampRouter");

app.use("/api/v1/bootcamps", bootcampRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  try {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port: http://localhost:3000`
    );
  } catch (error) {
    console.log(error);
  }
});
