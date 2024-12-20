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
    gstIn:[{
      gst_number:{type: String,required: true},
      company_name:{type: String,required: true},
      company_address:{type: String,required: true},
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
