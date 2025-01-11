import assetDelevery from "../models/assetDelevery.js";

export const getAssetDeleveryRequest = async (req, res) => {
  try {
    // Find the donor and populate the `products` field
    const AssetDeleveryRequest = await assetDelevery.find().populate("beneficeryRequestId").populate("partnerId").populate("assetId");

    if (!AssetDeleveryRequest) {
      return res.status(404).json({ success: false, message: "AssetDeleveryRequest not found" });
    }

    res.status(200).json({ success: true, message: "AssetDeleveryRequest fetched successfully", AssetDeleveryRequest });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}