import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  condition: {
    type: String,
    required: true,
    enum: ["Recycle", "Reuse", "Refurbished"],
  },
  images: [{ type: String }],
  quantity: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    default: "available",
    enum: ["available", "requested", "assigned", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

const donorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "donor" },
    donationDetails: { type: String },
    products: [productSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
