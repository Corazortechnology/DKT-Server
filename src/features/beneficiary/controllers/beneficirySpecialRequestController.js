import SpecialRequest from "../models/beneficorySpecialRequestModel.js";

export const createSpecialRequest = async (req, res) => {
  try {
    const {
      fullName,
      contactNumber,
      email,
      organizationName,
      role,
      address,
      city,
      state,
      pincode,
      alternateContactNumber,
      deviceType,
      operatingSystem,
      processor,
      ram,
      storage,
      purpose,
      reasonForRequest,
      quantity,
    } = req.body;

    const beneficiaryId = req.userId; // assuming req.userId is added by auth middleware

    const newRequest = new SpecialRequest({
      beneficiary: beneficiaryId,
      fullName,
      contactNumber,
      email,
      organizationName,
      role,
      address,
      city,
      state,
      pincode,
      alternateContactNumber,
      deviceType,
      operatingSystem,
      processor,
      ram,
      storage,
      purpose,
      reasonForRequest,
      quantity,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Special request submitted successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating special request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit special request",
    });
  }
};

export const getRequestsByBeneficiary = async (req, res) => {
  try {
    const requests = await SpecialRequest.find({ beneficiary: req.userId }).sort({ createdAt: -1 });
    console.log(requests," ",req.userId," req")
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

export const getAllSpecialRequests = async (req, res) => {
  try {
    const requests = await SpecialRequest.find().populate("beneficiary").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch all requests" });
  }
};

export const acceptSpecialRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await SpecialRequest.findByIdAndUpdate(
      requestId,
      { status: "Accepted" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ success: false, message: "Failed to accept request" });
  }
};

export const rejectSpecialRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await SpecialRequest.findByIdAndUpdate(
      requestId,
      { status: "Rejected" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ success: false, message: "Failed to reject request" });
  }
};
