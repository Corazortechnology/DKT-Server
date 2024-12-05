import Donor from "../models/donorModel.js";
import productUpload from "../models/productModel.js"
import jwt from "jsonwebtoken";

// Add Product (Single or Bulk)
export const addProduct = async (req, res) => {
  const { products, isBulk } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const donor = await Donor.findOne({ _id: userId });

    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }

    // Prepare the product upload data
    let newProductUpload = {
      donatedBy: donor._id,  // Reference to the donor
      donationDetails: req.body.donationDetails || "", // Optional donation details
      products: [], // Initialize products array
    };

    if (isBulk) {
      // Bulk product addition
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid products array" });
      }

      // Validate and add products for bulk upload
      newProductUpload.products = products.map((product) => ({
        name: product.name,
        description: product.description,
        category: product.category,
        condition: product.condition,
        images: product.images, // Images URLs from the bulk data
        quantity: product.quantity,
      }));
    } else {
      // Single product addition
      const { name, description, category, condition, quantity } = req.body;

      // if (!req.file) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Image file is required for single product",
      //   });
      // }

      // Upload image to Azure Blob (if applicable)
      // const imageUrl = await uploadToAzureBlob(req.file);

      // Add single product
      const newProduct = {
        name,
        description,
        category,
        condition,
        // images: [imageUrl], // Image URL from Azure Blob (if you are uploading images)
        quantity,
      };

      newProductUpload.products.push(newProduct);
    }

    // Save the product upload entry in the database
    const productsUpload = new productUpload(newProductUpload);
    await productsUpload.save();

    return res.status(200).json({
      success: true,
      message: "Products added successfully",
      products: productsUpload.products,
    });
  } catch (error) {
    console.error("Error adding products:", error);
    return res.status(500).json({ success: false, message: "Error adding products" });
  }
};
