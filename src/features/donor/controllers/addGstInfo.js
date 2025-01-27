// import jwt from "jsonwebtoken";
// import Donor from "../models/donorModel.js";

// export const addGstDetails = async (req, res) => {
//   try {
//     // Extract GST details from the request body
//     const { gst_number, company_name, company_address } = req.body;

//     // Validate the input fields
//     if (!gst_number || !company_name || !company_address) {
//       return res.status(400).json({
//         success: false,
//         message: "All GST details (gst_number, company_name, company_address) are required",
//       });
//     }

//     // Find the donor by ID
//     const donor = await Donor.findById(req.userId);
//     if (!donor) {
//       return res.status(404).json({ success: false, message: "Donor not found" });
//     }

//     // Check if the GST number already exists in the donor's gstIn array
//     const isGstAlreadyPresent = donor.gstIn.some(
//       (gst) => gst.gst_number === gst_number
//     );

//     if (isGstAlreadyPresent) {
//       return res.status(400).json({
//         success: false,
//         message: "GST details already present",
//       });
//     }

//     // Add the GST details to the donor's gstIn array
//     donor.gstIn.push({ gst_number, company_name, company_address });
//     await donor.save();

//     res.status(200).json({
//       success: true,
//       message: "GST details added successfully",
//       gstIn: donor.gstIn, // Return updated GST details
//     });
//   } catch (error) {
//     console.error("Error adding GST details:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while adding GST details",
//     });
//   }
// };

import jwt from "jsonwebtoken";
import Donor from "../models/donorModel.js";

export const addGstDetails = async (req, res) => {
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
    const donor = await Donor.findById(req.userId);
    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });
    }

    // Check if the GST number already exists in the donor's gstIn array
    const isGstAlreadyPresent = donor.gstIn.some(
      (gst) => gst.gst_number === gst_number
    );

    if (isGstAlreadyPresent) {
      return res.status(400).json({
        success: false,
        message: "GST details already present",
      });
    }

    // Add the GST details to the donor's gstIn array
    donor.gstIn.push({ gst_number, company_name, company_address });

    // Add the GST address directly to the address field as a single string with verified: true
    donor.address.push({ address: company_address, verified: true });

    await donor.save();

    res.status(200).json({
      success: true,
      message: "GST details and address added successfully",
      gstIn: donor.gstIn, // Return updated GST details
      address: donor.address, // Return updated address list
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

    // Find the donor by ID
    const donor = await Donor.findById(req.userId);
    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });
    }

    // Add the address to the address field (unverified by default)
    donor.address.push({
      address,
      verified: false, // Mark as unverified initially
    });

    // Save the updated donor
    await donor.save();

    res.status(200).json({
      success: true,
      message: "Address added successfully, pending verification",
      address: donor.address, // Return updated addresses
    });
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the address",
    });
  }
};

export const verifyAddressToDonor = async (req, res) => {
  try {
    const { donorId, addressId } = req.body;

    // Validate input fields
    if (!donorId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Donor ID and Address ID are required.",
      });
    }

    // Find the donor by ID
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found.",
      });
    }

    // Find the address by ID
    const address = donor.address.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Update the verified status to true
    address.verified = true;

    // Save the updated donor document
    await donor.save();

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
