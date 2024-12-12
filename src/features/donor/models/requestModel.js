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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "in-progress", "completed", "cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
