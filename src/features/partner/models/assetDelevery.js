import mongoose from "mongoose";

const assetsDelevery = new mongoose.Schema(
    {
        beneficeryRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BeneficiaryRequest",
            required: true,
        },
        assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        partnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner",
        },
        status: {
            type: String,
            default: "Requested",
            enum: ["Requested", "Assigned", "In-progress", "Delivered"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("assetsDelevery", assetsDelevery);
