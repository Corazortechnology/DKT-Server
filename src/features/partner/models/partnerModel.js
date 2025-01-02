import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    partnerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "partner" },
    servicesProvided: { type: String },
    verify: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Reject"],
    },
  },

  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
