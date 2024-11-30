import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    partnerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    servicesProvided: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
