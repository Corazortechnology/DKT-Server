import express from "express";
import {
  loginWithGoogle,
  loginWithOtp,
  requestOtp,
} from "../controllers/authController.js";
import {
  otpLimiter,
  registerLimiter,
} from "../../../middlewares/otpRateLimiter.js";
import {
  registerUser,
  requestOtpBeforSignup,
} from "../controllers/registrationController.js";
import {
  requestResetPasswordOtp,
  resetPassword,
  verifyResetPasswordOtp,
} from "../controllers/resetPasswordController.js";

const router = express.Router();

// registration
router.post("/register/request-otp", requestOtpBeforSignup);
router.post("/register", registerUser);

// login
router.post("/request-otp", requestOtp);
router.post("/login-with-otp", loginWithOtp);
router.post("/login-with-google", loginWithGoogle);

// reset password
router.post("/request-reset-password-otp", requestResetPasswordOtp);
router.post("/verify-reset-password-otp", verifyResetPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;
