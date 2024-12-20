import Donor from "../models/donorModel.js";

export const getDonorDetails = async (req, res) => {
  try {
    const donorId = req.userId; // This is set by the `authenticateToken` middleware

    // Find the donor and populate the `products` field
    const donor = await Donor.findById(donorId).populate("products");

    if (!donor) {
      return res.status(404).json({success:false, message: "Donor not found" });
    }

    res.status(200).json({success:true, message: "Donor details fetched successfully", donor });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({success:false, message: "Server error" });
  }
};

export const getDonorById = async (req, res) => {
  try {
    const {id} = req.body; // This is set by the `authenticateToken` middleware

    // Find the donor and populate the `products` field
    const donor = await Donor.findById(id).populate("products");

    if (!donor) {
      return res.status(404).json({success:false, message: "Donor not found" });
    }

    res.status(200).json({success:true, message: "Donor details fetched successfully", donor });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({success:false, message: "Server error" });
  }
};

export const getAllDonor = async (req, res) => {
  try {
    const donorId = req.userId; // This is set by the `authenticateToken` middleware

    // Find the donor and populate the `products` field
    const donor = await Donor.find().populate("products");

    if (!donor) {
      return res.status(404).json({success:false, message: "Donors not found" });
    }

    res.status(200).json({ success:true,message: "Donors fetched successfully", donor });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ success:false,message: "Server error" });
  }
};
