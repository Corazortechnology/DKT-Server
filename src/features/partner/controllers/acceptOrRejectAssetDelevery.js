import mongoose from "mongoose";
import beneficiaryRequestModel from "../../beneficiary/models/beneficiaryRequestModel.js";
import assetDelevery from "../models/assetDelevery.js";

export const acceptOrRejectAssetDelevery = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const partnerId = decoded.userId;

    // Validate partnerId format
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid partnerId format" });
    }

    const { requestId, status } = req.body;

    // Find the asset delivery request by ID
    const request = await assetDelevery.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Asset delivery request not found",
      });
    }

    // Update the status and partner ID
    request.status = status;
    request.partnerId = partnerId;

    // Find the related beneficiary request by ID
    const beneficiaryRequest = await beneficiaryRequestModel.findById(
      request.beneficeryRequestId
    );
    if (!beneficiaryRequest) {
      return res.status(404).json({
        success: false,
        message: "Beneficiary request not found",
      });
    }

    // Update the assigned details in the beneficiary request
    beneficiaryRequest.assignedDetails.status = "In-progress";

    // Save both updates
    await Promise.all([request.save(), beneficiaryRequest.save()]);

    return res.status(200).json({
      success: true,
      message: "Asset delivery request updated successfully",
    });
  } catch (error) {
    console.error("Error in acceptOrRejectAssetDelevery:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
