import OTP from "../models/otpModel.js"
import crypto from "crypto";

export const generateOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  const otpInstance = new OTP({ email, otp });
  await otpInstance.save();
  return otp;
};

export const verifyOTP = async (email, otp) => {
  console.log("Incoming Email:", email);
  console.log("Incoming OTP:", otp);

  const validOtp = await OTP.findOne({ email });
  console.log("Found OTP Record:", validOtp); // Debugging

  if (!validOtp) {
    console.log("OTP not found or expired.");
    return false;
  }

  await OTP.deleteOne({ email }); // Ensure OTP is used only once
  return true;
};

