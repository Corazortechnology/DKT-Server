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
import {
  adminDashboard,
  beneficiaryDashboard,
  donorDashboard,
  partnerDashboard,
} from "../controllers/dashboardController.js";
import { authorizeRoles } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// registration
router.post("/register/request-otp", otpLimiter, requestOtpBeforSignup);
router.post("/register", registerLimiter, registerUser);

// login
router.post("/request-otp", otpLimiter, requestOtp);
router.post("/login-with-otp", loginWithOtp);
router.post("/login-with-google", loginWithGoogle);

// reset password
router.post("/request-reset-password-otp", otpLimiter, requestResetPasswordOtp);
router.post("/verify-reset-password-otp", verifyResetPasswordOtp);
router.post("/reset-password", resetPassword);

// Protected Routes
router.get("/donor-dashboard", authorizeRoles(["donor"]), donorDashboard);
router.get("/partner-dashboard", authorizeRoles(["partner"]), partnerDashboard);
router.get(
  "/beneficiary-dashboard",
  authorizeRoles(["beneficiary"]),
  beneficiaryDashboard
);
router.get("/admin-dashboard", authorizeRoles(["admin"]), adminDashboard);

export default router;
