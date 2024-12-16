import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateOTP, verifyOTP } from "../services/otpService.js";
import { verifyGoogleToken } from "../services/googleService.js";
import Beneficiary from "../../beneficiary/models/beneficiaryModel.js";
import Donor from "../../donor/models/donorModel.js";
import Admin from "../../admin/models/adminModel.js";
import Partner from "../../partner/models/partnerModel.js";
import { sendEmail } from "../../../services/emailService.js";

const sections = {
  beneficiary: Beneficiary,
  donor: Donor,
  admin: Admin,
  partner: Partner,
};

// Request OTP after password verification
export const requestOtp = async (req, res) => {
  const { email, section } = req.body;

  try {
    // Validate section
    const SectionModel = sections[section];
    if (!SectionModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid section" });
    }

    // Find user by email
    const user = await SectionModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered in this section",
      });
    }

    // // Verify password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid password" });
    // }
    // Generate OTP
    const otp = await generateOTP(email);

    // Send OTP via email
    await sendEmail(email, "otp", { otp });

    return res
      .status(200)
      .json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    console.error("Error during OTP request:", error);
    res.status(500).json({ success: false, message: "Error requesting OTP" });
  }
};

// Login with OTP
export const loginWithOtp = async (req, res) => {
  const { email, section, otp } = req.body;

  try {
    const SectionModel = sections[section];
    if (!SectionModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid section" });
    }

    const user = await SectionModel.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered in this section",
      });
    }

    // Verify OTP
    const isOtpValid = await verifyOTP(email, otp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Generate JWT
    const token = jwt.sign(
      { email, section, role: user.role, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ success: true, message: "User login successfully", token });
  } catch (error) {
    console.error("Error during login with OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error during login" });
  }
};

// Login with Google
export const loginWithGoogle = async (req, res) => {
  const { token, section } = req.body;
  try {
    const SectionModel = sections[section];
    if (!SectionModel)
      return res
        .status(400)
        .json({ success: false, message: "Invalid section" });
    const payload = await verifyGoogleToken(token);
    console.log(payload)
    const user = await SectionModel.findOne({ email: payload.email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "Email not registered in this section",
      });

    const jwtToken = jwt.sign(
      { email: payload.email, section, role: user.role, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ success: true, token: jwtToken });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Google token" });
  }
};
