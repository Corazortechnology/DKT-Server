import beneficiaryModel from "../models/beneficiaryModel.js";
import jwt from "jsonwebtoken";

// export const addBeneficaryGstDetails = async (req, res) => {
//   try {
//     // Extract GST details from the request body
//     const { gst_number, company_name, company_address } = req.body;

//     // Validate the input fields
//     if (!gst_number || !company_name || !company_address) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "All GST details (gst_number, company_name, company_address) are required",
//       });
//     }

//     // Find the donor by ID
//     const beneficiary = await beneficiaryModel.findById(req.userId);
//     if (!beneficiary) {
//       return res
//         .status(404)
//         .json({ success: false, message: "beneficiary not found" });
//     }

//     // Check if the GST number already exists in the donor's gstIn array
//     const isGstAlreadyPresent = beneficiary.gstIn.some(
//       (gst) => gst.gst_number === gst_number
//     );

//     if (isGstAlreadyPresent) {
//       return res.status(400).json({
//         success: false,
//         message: "GST details already present",
//       });
//     }

//     // Add the GST details to the donor's gstIn array
//     beneficiary.gstIn.push({ gst_number, company_name, company_address });
//     await beneficiary.save();

//     res.status(200).json({
//       success: true,
//       message: "GST details added successfully",
//       gstIn: beneficiary.gstIn, // Return updated GST details
//     });
//   } catch (error) {
//     console.error("Error adding GST details:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while adding GST details",
//     });
//   }
// };

export const addBeneficaryGstDetails = async (req, res) => {
  try {
    // Extract GST details from the request body
    const { gst_number, company_name, company_address } = req.body;

    // Validate the input fields
    if (!gst_number || !company_name || !company_address) {
      return res.status(400).json({
        success: false,
        message:
          "All GST details (gst_number, company_name, company_address) are required",
      });
    }

    // Find the donor by ID
    const beneficiary = await beneficiaryModel.findById(req.userId);
    if (!beneficiary) {
      return res
        .status(404)
        .json({ success: false, message: "Beneficiary not found" });
    }

    // Check if the GST number already exists in the donor's gstIn array
    const isGstAlreadyPresent = beneficiary.gstIn.some(
      (gst) => gst.gst_number === gst_number
    );

    if (isGstAlreadyPresent) {
      return res.status(400).json({
        success: false,
        message: "GST details already present",
      });
    }

    // Add the GST details to the donor's gstIn array
    beneficiary.gstIn.push({ gst_number, company_name, company_address });

    // Add the GST address directly to the address field as a single string with verified: true
    beneficiary.address.push({ address: company_address, verified: true });

    await beneficiary.save();

    res.status(200).json({
      success: true,
      message: "GST details and address added successfully",
      gstIn: beneficiary.gstIn, // Return updated GST details
      address: beneficiary.address, // Return updated address list
    });
  } catch (error) {
    console.error("Error adding GST details:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding GST details",
    });
  }
};

export const addAddress = async (req, res) => {
  try {
    // Extract address from the request body
    const { address } = req.body;

    // Validate input fields
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    // Find the beneficiary by ID
    const beneficiary = await beneficiaryModel.findById(req.userId);
    if (!beneficiary) {
      return res
        .status(404)
        .json({ success: false, message: "Beneficiary not found" });
    }

    // Add the address to the address field (unverified by default)
    beneficiary.address.push({
      address,
      verified: false, // Mark as unverified initially
    });

    // Save the updated donor
    await beneficiary.save();

    res.status(200).json({
      success: true,
      message: "Address added successfully, pending verification",
      address: beneficiary.address, // Return updated addresses
    });
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the address",
    });
  }
};

export const verifyAddressToBeneficiary = async (req, res) => {
  try {
    const { beneficiaryId, addressId } = req.body;

    // Validate input fields
    if (!beneficiaryId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Beneficiary ID and Address ID are required.",
      });
    }

    // Find the beneficiary by ID
    const beneficiary = await beneficiaryModel.findById(beneficiaryId);

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: "Beneficiary not found.",
      });
    }

    // Find the address by ID
    const address = beneficiary.address.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Update the verified status to true
    address.verified = true;

    // Save the updated beneficiary document
    await beneficiary.save();

    res.status(200).json({
      success: true,
      message: "Address verified successfully.",
      address, // Return the updated address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying the address.",
    });
  }
};
