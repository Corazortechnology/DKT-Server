import jwt from "jsonwebtoken";
import Donor from "../models/donorModel.js";

// Add product to donor's list
export const addProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token is required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const donorEmail = decoded.email;

    // Find the donor by email from the token
    const donor = await Donor.findOne({ email: donorEmail });
    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });
    }

    // Extract image paths from Multer's file processing
    const images = req.files.map((file) => file.path);

    // Get product details from request body
    const { name, description, category, condition, quantity } = req.body;

    // Add the product to the donor's list
    donor.products.push({
      name,
      description,
      category,
      condition,
      quantity,
      images,
    });

    // Save changes to the database
    await donor.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: donor.products,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    console.error("Error adding product:", error.message);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};
