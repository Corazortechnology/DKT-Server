import beneficiaryRequestModel from "../../beneficiary/models/beneficiaryRequestModel.js";
import productModel from "../../donor/models/productModel.js";
import assetDelevery from "../../partner/models/assetDelevery.js";

export const creatAssetDeleveryRequest = async (req, res) => {
  try {
    const { request, assetId } = req.body;

    // Validate input
    if (!request || !assetId || !Array.isArray(assetId) || assetId.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Check if all assets are unassigned
    const assignedAssets = await productModel.find({
      _id: { $in: assetId },
      "assignedToBeneficiary.beneficiaryId": { $exists: true }, // Find assigned assets
    });

    if (assignedAssets.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Request contains already assigned assets. Assigned assets: ${assignedAssets.map((asset) => asset._id).join(", ")}`,
      });
    }

    // Proceed with the request as all assets are unassigned
    const newRequest = new assetDelevery({
      beneficeryRequestId: request._id,
      assetId,
    });

    if (!newRequest) {
      return res.status(404).json({ success: false, message: "Request not created" });
    }

    // Update product statuses to "assigned"
    await productModel.updateMany(
      { _id: { $in: assetId } },
      {
        $set: {
          "assignedToBeneficiary.beneficiaryId": request.beneficiaryId,
          "assignedToBeneficiary.status": "Assigned",
          "assignedToBeneficiary.date": new Date(),
        },
      }
    );

    // Save the new delivery request
    await newRequest.save();

    const updateBeneficeryRequest = await beneficiaryRequestModel.findOne({_id:request._id});
    updateBeneficeryRequest.assignedDetails.assetIds = assetId
    updateBeneficeryRequest.assignedDetails.status = "Assigned" 
    updateBeneficeryRequest.assignedDetails.date = new Date()

    await updateBeneficeryRequest.save();

    res.status(200).json({
      success: true,
      message: `Request created successfully! All assets have been assigned.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
