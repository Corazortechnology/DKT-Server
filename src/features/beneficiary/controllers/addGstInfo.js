import beneficiaryModel from "../models/beneficiaryModel.js";

export const addBeneficaryGstDetails = async (req, res) => {
  try {
    // Extract GST details from the request body
    const { gst_number, company_name, company_address } = req.body;

    // Validate the input fields
    if (!gst_number || !company_name || !company_address) {
      return res.status(400).json({
        success: false,
        message: "All GST details (gst_number, company_name, company_address) are required",
      });
    }

    // Find the donor by ID
    const beneficiary = await beneficiaryModel.findById(req.userId);
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "beneficiary not found" });
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
    await beneficiary.save();

    res.status(200).json({
      success: true,
      message: "GST details added successfully",
      gstIn: beneficiary.gstIn, // Return updated GST details
    });
  } catch (error) {
    console.error("Error adding GST details:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding GST details",
    });
  }
};
