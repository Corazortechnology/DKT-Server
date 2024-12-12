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
},{
    timestamps:true
});


export default mongoose.model("Product", productSchema);
