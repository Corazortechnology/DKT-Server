import beneficiaryModel from "../models/beneficiaryModel.js";

// Create a new asset request
export const createAssetRequest = async (req, res) => {
  try {
    const { deviceType, quantity } = req.body;

    if (!deviceType || !quantity) {
      return res
        .status(400)
        .json({ message: "Device type and quantity are required." });
    }

    const beneficiary = await beneficiaryModel.findById(req.user.id);

    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found." });
    }

    const newRequest = {
      deviceType,
      quantity,
    };

    beneficiary.assetRequests.push(newRequest);
    await beneficiary.save();

    res.status(201).json({
      message: "Asset request created successfully.",
      request: newRequest,
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
    const beneficiary = await beneficiaryModel
      .findById(req.user.id)
      .select("assetRequests");

    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found." });
    }

    res.status(200).json({ requests: beneficiary.assetRequests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Update request status (for admin usage)
export const updateAssetRequestStatus = async (req, res) => {
  try {
    const { beneficiaryId, requestId } = req.params;
    const { status, adminComments } = req.body;

    const beneficiary = await beneficiaryModel.findById(beneficiaryId);

    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found." });
    }

    const request = beneficiary.assetRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ message: "Asset request not found." });
    }

    request.status = status || request.status;
    request.adminComments = adminComments || request.adminComments;

    await beneficiary.save();

    res
      .status(200)
      .json({ message: "Request status updated successfully.", request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
