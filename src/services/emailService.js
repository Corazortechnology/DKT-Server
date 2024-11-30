import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.EMAIL_FROM;
const pass = process.env.EMAIL_PASS;

// Configure the transporter using your email and credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

// Function to send OTP and Greeting

export const sendEmail = async (email, type, data) => {
  // Determine the email content based on the type
  let subject;
  let html;

  if (type === "otp") {
    subject = "Your OTP for Logging In";
    html = `
      <div>
        <h3>OTP Verification</h3>
        <p>Your one-time password (OTP) for logging in is: <strong>${data.otp}</strong>. This OTP is valid for the next 5 minutes. Please use it to complete your login process.</p>
        <p>If you did not request this, please ignore this message or contact our support team.</p>
        </br>
        <p>Best regards,<br />The DKT Platform Team</p>
        </div>
    `;
  } else if (type === "resetPassword") {
    subject = "Reset Your Password - OTP Verification";
    html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #45AFAB;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account on <strong>DKT Platform</strong>.</p>
        <p>Your OTP for resetting your password is:</p>
        <h3 style="background: #f3f3f3; padding: 10px; display: inline-block; border-radius: 5px; color: #45AFAB;">
          ${data.otp}
        </h3>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email. If you suspect any unauthorized activity, please contact our support team immediately.</p>
        <p style="margin-top: 20px;">Best regards,<br />The DKT Platform Team</p>
      </div>
    `;
  } else if (type === "greeting") {
    subject = "Welcome to DKT Platform!";
    html = `
      <div>
        <h3>Welcome, ${data.name || data.companyName || data.partnerName}!</h3>
        <p>Thank you for registering on our platform. We are excited to have you onboard.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br />The DKT Platform Team</p>
      </div>
    `;
  } else if (type === "register") {
    subject = "Your OTP Code";
    html = `
      <div>
        <h3>OTP Verification</h3>
        <p>Your one-time password (OTP) for Verification is: <strong>${data.otp}</strong>. This OTP is valid for the next 5 minutes. Please use it to complete your registration process.</p>
        <p>If you did not request this, please ignore this message or contact our support team.</p>
        </br>
        <p>Best regards,<br />The DKT Platform Team</p>
        </div>
    `;
  } else {
    throw new Error("Invalid email type specified");
  }

  const mailOptions = {
    from: user, // Sender address
    to: email, // Recipient's email
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} (type: ${type})`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};
