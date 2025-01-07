import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
    },
    address: {type:String,required: true},
    shippingDate: {type:String,required: true},
    description: {type:String},
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    status: { 
      type: String,
      default: "Requested",
      enum: ["Requested", "Assigned", "In-progress", "Delivered"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
