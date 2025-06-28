// import requestModel from "../../donor/models/requestModel.js";
import vendorModel from "../models/vendorModel.js";

export const getVendorDetails = async (req, res) => {
  try {
    console.log("vendorId");
    const vendorId = req.userId; // This is set by the `authenticateToken` middleware
    console.log(vendorId);

    // Find the donor and populate the `products` field
    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found!!" });
    }

    res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      vendor,
    });
  } catch (error) {
    console.error("Error fetching Vendor details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllVendor = async (req, res) => {
  try {
    // Find the donor and populate the `products` field
    const vendor = await vendorModel.find();

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Vendor fetched successfully", vendor });
  } catch (error) {
    console.error("Error fetching Vendor details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.body;
    // Find the donor and populate the `products` field
    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Vendor fetched successfully", vendor });
  } catch (error) {
    console.error("Error fetching Vendor details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const getVendorRequestsById = async (req, res) => {
//   try {
//     const { vendorId } = req.body;
//     const requestedProducts = await requestModel
//       .find({ partner: vendorId })
//       .populate("donor")
//       .populate("partner")
//       .populate("products")
//       .sort({ updatedAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: requestedProducts,
//       message: "requests found successfully!!",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };
// export const getPartnerRequestsBy_Id = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const requestedProducts = await requestModel
//       .find({ _id: requestId })
//       .populate("donor")
//       .populate("partner")
//       .populate("products").sort({ updatedAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: requestedProducts,
//       message: "requests found successfully!!"
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };
