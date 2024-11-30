import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Product name
  description: { type: String, required: true }, // Product description
  category: { type: String, required: true }, // Product category (e.g., electronics, furniture)
  condition: {
    type: String,
    required: true,
    enum: ["New", "Used", "Refurbished"], // Product condition
  },
  images: [{ type: String, required: true }], // Array of image URLs or paths
  quantity: { type: Number, required: true, min: 1 }, // Quantity of items
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const donorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true }, // Donor's company name
    email: { type: String, required: true, unique: true }, // Donor's email
    password: { type: String, required: true },
    donationDetails: { type: String }, // Optional donation details
    products: [productSchema], // Array of products added by the donor
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
