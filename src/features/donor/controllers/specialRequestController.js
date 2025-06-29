import specialRequestModel from "../models/specialRequestModel.js";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECURITY_KEY,
});

// POST /api/special-requests
export const createSpecialRequest = async (req, res) => {
  try {
    const { donationFields, donationRange, donorNote } = req.body;
    const donorId = req.userId;

    // Validate required fields
    if (
      !donationFields ||
      !Array.isArray(donationFields) ||
      donationFields.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Donation fields are required" });
    }

    if (
      !donationRange ||
      typeof donationRange.min !== "number" ||
      typeof donationRange.max !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Donation range is required and must include min and max",
      });
    }

    // Create special request
    const specialRequest = new specialRequestModel({
      donor: donorId, // assumes donor is authenticated and user is attached via middleware
      donationFields,
      donationRange,
      donorNote,
    });

    await specialRequest.save();

    return res.status(201).json({
      success: true,
      message: "Special request submitted successfully",
      data: specialRequest,
    });
  } catch (err) {
    console.error("Error creating special request:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/special-requests/donor/:donorId
export const getSpecialRequestsByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;

    const requests = await specialRequestModel
      .find({ donor: donorId })
      .populate("donor", "name email")
      .populate("decisionBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "request found successFull!!",
      data: requests,
    });
  } catch (err) {
    console.error("Error fetching donor special requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/special-requests/my
export const getMySpecialRequests = async (req, res) => {
  try {
    const donorId = req.userId;

    const requests = await specialRequestModel
      .find({ donor: donorId })
      .populate("donor", "companyName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "request found successFull!!",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/special-requests/my
export const getAllSpecialRequests = async (req, res) => {
  try {
    console.log("here");
    const requests = await specialRequestModel
      .find({})
      .populate("donor", "companyName email _id") // <-- populate donor details
      .populate("decisionBy", "name email")
      .sort({ createdAt: -1 }); // <-- already present

    console.log(requests);
    res.status(200).json({
      success: true,
      message: "Request found successfully!",
      data: requests,
    });
  } catch (error) {
    console.error(error); // log the error for debugging
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Accept Special Request
export const acceptSpecialRequest = async (req, res) => {
  const { id } = req.params;
  const { requestedAmount, adminNote } = req.body;
  const adminId = req.userID; // ✅ assuming this is set by auth middleware

  try {
    const updatedRequest = await specialRequestModel.findByIdAndUpdate(
      id,
      {
        status: "Accepted",
        requestedAmount,
        adminNote,
        decisionBy: adminId,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject Special Request
export const rejectSpecialRequest = async (req, res) => {
  const { id } = req.params;
  const { adminNote } = req.body;
  const adminId = req.userID;

  try {
    const updatedRequest = await specialRequestModel.findByIdAndUpdate(
      id,
      {
        status: "Rejected",
        adminNote,
        decisionBy: adminId,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const UpdateAgreement = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { amount, adminNote } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const request = await specialRequestModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Special request not found" });
    }

    request.requestedAmount = amount;
    request.adminNote = adminNote;
    request.agreementCreated = true;
    await request.save();

    return res
      .status(200)
      .json({ message: "Agreement created successfully", data: request });
  } catch (error) {
    console.error("Agreement creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { specialRequestId, transactionId, fundTransferDate, paymentMethod } =
      req.body;

    if (!specialRequestId || !transactionId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const updatedRequest = await specialRequestModel.findByIdAndUpdate(
      specialRequestId,
      {
        $set: {
          "paymentDetail.status": "Active",
          "paymentDetail.paid": true,
          "paymentDetail.transactionId": transactionId,
          "paymentDetail.paymentMethod": paymentMethod || "RazorPay",
          "paymentDetail.fundTransferDate": fundTransferDate || new Date(),
        },
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Special Request not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Payment status updated",
        data: updatedRequest,
      });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const specialRequestCheckout = async (req, res) => {
  try {
    const { specialRequestId } = req.body;

    const request = await specialRequestModel.findById(specialRequestId);
    if (!request || !request.requestedAmount) {
      return res.status(404).json({
        success: false,
        message: "Special request not found or no requested amount",
      });
    }

    const options = {
      amount: Number(request.requestedAmount * 100), // Convert to paise
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Razorpay order created",
      data: order,
      specialRequestId: request._id,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during checkout" });
  }
};