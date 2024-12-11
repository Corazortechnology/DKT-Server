import mongoose from "mongoose";

const requestedProductSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      default: "requested",
      enum: ["requested", "assigned", "in-progress", "delivered"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("RequestedProduct", requestedProductSchema);
