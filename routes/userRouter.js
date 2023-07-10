const express = require("express");
const router = express.Router();

const {
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const User = require("../models/userModel");

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.use(protect);

router.route("/me").get(getCurrentUser);

router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getAllUsers).post(createUser);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
