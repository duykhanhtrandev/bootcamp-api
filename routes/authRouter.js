const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);

module.exports = router;
