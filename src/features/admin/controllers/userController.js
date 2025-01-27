import donorModel from "../../donor/models/donorModel.js";

export const getAllDonor = async (req, res) => {
  try {
    // Find the donor and populate the `products` field
    const donor = await donorModel.find();

    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donors not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Donors fetched successfully", donor });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
