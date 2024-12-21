import beneficiaryModel from "../models/beneficiaryModel.js";

export const getBeneficiaryDetails = async (req, res) => {
    try {
      const beneficiaryId = req.userId; // This is set by the `authenticateToken` middleware
  
      const beneficiary = await beneficiaryModel.findById(beneficiaryId)
  
      if (!beneficiary) {
        return res.status(404).json({success:false, message: "beneficiary not found" });
      }
  
      res.status(200).json({success:true, message: "beneficiary details fetched successfully", beneficiary });
    } catch (error) {
      console.error("Error fetching beneficiary details:", error);
      res.status(500).json({success:false, message: "Server error" });
    }
  };