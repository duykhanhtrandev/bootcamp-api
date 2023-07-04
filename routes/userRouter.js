const express = require("express");
const router = express.Router();

const { getCurrentUser } = require("../controllers/userController");

const { protect } = require("../middleware/auth");

router.route("/me").get(protect, getCurrentUser);

module.exports = router;
