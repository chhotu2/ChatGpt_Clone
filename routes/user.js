const express = require("express");
const router = express.Router();

const { login, register, sendotp, logout, sendmobileOtp, forgetPassword, resetPassword } = require("../controllers/Auth");

const { auth } = require("../middleware/auth");

router.post("/login", login);

router.post("/signup", register);

router.post("/sendotp", sendotp);

router.post("/logout", auth, logout);

router.post("/sendmobileotp", sendmobileOtp);

router.post("/forgetPassword", forgetPassword);

router.post("/reset-password", resetPassword);



module.exports = router;
