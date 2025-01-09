import mongoose from "mongoose";

const assetRequestSchema = new mongoose.Schema(
  {
    beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: "Beneficiary" },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    organizationName: { type: String, required: true },
    address: { type: String, required: true },
    deviceType: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // pending, accepted, rejected
    adminComments: { type: String },
    assignedDetails: {
      assetIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Assigned", "In-progress", "Delivered"],
      },
      date: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("BeneficiaryRequest", assetRequestSchema);
