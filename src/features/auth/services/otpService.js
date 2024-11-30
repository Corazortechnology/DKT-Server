import OTP from "../models/otpModel.js";
import crypto from "crypto";

export const generateOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  await OTP.create({ email, otp });
  return otp;
};

export const verifyOTP = async (email, otp) => {
  const validOtp = await OTP.findOne({ email, otp });
  if (!validOtp) return false;
  await OTP.deleteOne({ email }); // Ensure OTP is used only once
  return true;
};
