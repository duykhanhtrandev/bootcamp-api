const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviewModel");

const {
  getAllReviews,
  getSingleReview,
  createReview,
} = require("../controllers/reviewController");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router.route("/:id").get(getSingleReview);

module.exports = router;
