import mongoose from "mongoose";


const donorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "donor" },
    donationDetails: { type: String },
    products: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Product"
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
