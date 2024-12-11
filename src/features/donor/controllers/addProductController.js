import mongoose from "mongoose";
import Donor from "../models/donorModel.js";
import jwt from "jsonwebtoken";
import { uploadToAzureBlob } from "../../../utils/azureBlob.js";

// Add Product (Single or Bulk)
export const addProduct = async (req, res) => {
  const { products, isBulk } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Decode the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format" });
    }

    // Look for the donor by userId
    const donor = await Donor.findById(userId);
    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });
    }

    // Prepare the product data
    if (isBulk) {
      // Bulk product addition
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid products array" });
      }

      // Iterate through each product and add to the donor's product array
      for (let product of products) {
        const { name, description, category, condition, quantity, images } =
          product;

        // Validate each product field
        if (!name || !description || !category || !condition || !quantity) {
          return res
            .status(400)
            .json({ success: false, message: "Missing product fields" });
        }
        // Create the new product object
        const newProduct = {
          name,
          description,
          category,
          condition,
          quantity,
          images: images,
        };

        // Push the new product to the donor's product array
        donor.products.push(newProduct);
        await donor.save(); // Save the donor after adding the product
      }

      return res.status(200).json({
        success: true,
        message: "Products added successfully (bulk)",
        products: donor.products,
      });
    } else {
      // Single product addition
      const { name, description, category, condition, quantity } = req.body;
      if (!name || !description || !category || !condition || !quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Missing product fields" });
      }

      // Check if a file is uploaded (image for the single product)
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided" });
      }

      // Handle image upload for the single product
      const image_url = await uploadToAzureBlob(req.file);

      // Create the new product object
      const newProduct = {
        name,
        description,
        category,
        condition,
        quantity,
        images: [image_url], // Save the uploaded image URL in the images array
      };

      // Add the single product to the donor's products array
      donor.products.push(newProduct);
      await donor.save(); // Save the donor with the new product

      return res.status(200).json({
        success: true,
        message: "Product added successfully (single)",
        product: newProduct,
      });
    }
  } catch (error) {
    console.error("Error adding products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error adding products" });
  }
};
// get product controler

// Get all product uploads for the authenticated donor
export const getProductUploads = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Verify the token and decode the user ID (donor's ID)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format" });
    }

    // Find the donor by ID
    const donor = await Donor.findById(userId);

    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });
    }

    // Retrieve the products uploaded by the donor from the products array
    const productUploads = donor.products;

    if (productUploads.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No product uploads found" });
    }

    // Return the product uploads
    return res.status(200).json({
      success: true,
      message: "Product uploads retrieved successfully",
      products: productUploads,
    });
  } catch (error) {
    console.error("Error fetching product uploads:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching product uploads" });
  }
};
