import beneficiaryModel from "../models/beneficiaryModel.js";
import beneficiaryRequestModel from "../models/beneficiaryRequestModel.js";

// Create a new asset request
export const createAssetRequest = async (req, res) => {
  try {
    const { deviceType, quantity } = req.body;

    if (!deviceType || !quantity) {
      return res
        .status(400)
        .json({ message: "Device type and quantity are required." });
    }

    const newRequest = {
      deviceType,
      quantity,
      beneficiaryId: req.userId, // Assuming req.userId is set by middleware
    };

    const request = await beneficiaryRequestModel.create(newRequest);

    res.status(201).json({
      message: "Asset request created successfully.",
      request,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};


// Get all asset requests for the beneficiary
export const getAssetRequests = async (req, res) => {
  try {
    const requests = await beneficiaryRequestModel
      .find({ beneficiaryId: req.userId }).populate("beneficiaryId")
      .sort({ createdAt: -1 }); // Fetch all requests for the logged-in beneficiary

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No asset requests found." });
    }

    res.status(200).json({ requests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};


// Update request status (for admin usage)
export const updateAssetRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminComments } = req.body;

    const request = await beneficiaryRequestModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Asset request not found." });
    }

    // Update the status and admin comments
    request.status = status || request.status;
    request.adminComments = adminComments || request.adminComments;

    await request.save();

    res.status(200).json({
      message: "Request status updated successfully.",
      request,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

