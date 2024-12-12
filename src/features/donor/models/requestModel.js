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
    products: [
      {
        type:mongoose.Schema.Types.ObjectId,
      ref:"Product",
        required: true,
      },
    ],
    status: {
      type: String,
      default: "requested",
      enum: ["requested", "assigned", "in-progress", "delivered"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
