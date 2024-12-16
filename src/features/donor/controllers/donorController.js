import Donor from "../models/donorModel.js";

export const getDonorDetails = async (req, res) => {
  try {
    const donorId = req.userId; // This is set by the `authenticateToken` middleware

    // Find the donor and populate the `products` field
    const donor = await Donor.findById(donorId).populate("products");

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({ message: "Donor details fetched successfully", donor });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
