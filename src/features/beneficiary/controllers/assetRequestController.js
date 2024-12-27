import { sendEmail } from "../../../services/emailService.js";
import beneficiaryModel from "../models/beneficiaryModel.js";
import beneficiaryRequestModel from "../models/beneficiaryRequestModel.js";

// Create a new asset request
export const createAssetRequest = async (req, res) => {
  try {
    const { name, category, organizationName, address, deviceType, quantity } =
      req.body;
    console.log(
      name,
      category,
      organizationName,
      address,
      deviceType,
      quantity
    );

    if (
      !deviceType ||
      !quantity ||
      !name ||
      !category ||
      !organizationName ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRequest = {
      productName: name,
      category,
      organizationName,
      address,
      deviceType,
      quantity,
      beneficiaryId: req.userId, // Assuming req.userId is set by middleware
    };

    const request = await beneficiaryRequestModel.create(newRequest);

     
    //getting beneficeary
    const getBeneficeary = await beneficiaryModel.findById(req.userId)

    await sendEmail(getBeneficeary.email,"assetRequest",{requestId:request._id})

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
      .find({ beneficiaryId: req.userId })
      .populate("beneficiaryId")
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
    console.log(status);

    const request = await beneficiaryRequestModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Asset request not found." });
    }

    // Update the status and admin comments
    request.status = status || request.status;
    request.adminComments = adminComments || request.adminComments;

    await request.save();
    const benedicearyId = request.beneficiaryId
    const beneficeary = await beneficiaryModel.findById(benedicearyId);
    await sendEmail(beneficeary.email,"assetRequestResponce",{requestId:request._id,status})

    res.status(200).json({
      success: true,
      message: "Request status updated successfully.",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
