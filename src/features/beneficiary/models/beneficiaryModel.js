import mongoose from "mongoose";

const assetRequestSchema = new mongoose.Schema(
  {
    deviceType: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "pending" }, // pending, approved, rejected
    adminComments: { type: String },
  },
  { timestamps: true }
);

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "beneficiary" },
    schoolName: { type: String, required: true }, // Specific to beneficiaries
    otherDetails: { type: String },
    assetRequests: [assetRequestSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiary", beneficiarySchema);
