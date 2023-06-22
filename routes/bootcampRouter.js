const express = require("express");
const router = express.Router();

const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcampController");

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getAllBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
