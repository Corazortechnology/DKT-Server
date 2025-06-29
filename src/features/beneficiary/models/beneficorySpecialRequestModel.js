import mongoose from "mongoose";

const specialRequestSchema = new mongoose.Schema(
  {
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },
    // ✅ User Info
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    organizationName: { type: String, required: true },
    role: { type: String, required: true },

    // ✅ Address
    address: {
      pickupCode: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    alternateContactNumber: { type: String, required: true },

    // ✅ Laptop Specification
    deviceType: { type: String, enum: ["Laptop"], required: true },
    operatingSystem: { type: String, required: true },
    processor: { type: String, required: true },
    ram: { type: Number, required: true },
    storage: { type: Number, required: true },

    // ✅ Request Purpose
    purpose: { type: String, required: true },
    reasonForRequest: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      default: "Requested",
      enum: ["Requested","Accepted", "Rejected", "Assigned", "Pickedup", "Delivered"],
    },
  },
  {
    timestamps: true,
  }
);

const SpecialRequest = mongoose.model("BeneficiarySpecialRequest", specialRequestSchema);
export default SpecialRequest;
