import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    schoolName: { type: String, required: true }, // Specific to beneficiaries
    otherDetails: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiary", beneficiarySchema);
