import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "beneficiary" },
    schoolName: { type: String, required: true }, // Specific to beneficiaries
    otherDetails: { type: String },
    gstIn: [
      {
        gst_number: { type: String, required: true },
        company_name: { type: String, required: true },
        company_address: { type: String, required: true },
      },
    ],
    verify: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Reject"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiary", beneficiarySchema);
