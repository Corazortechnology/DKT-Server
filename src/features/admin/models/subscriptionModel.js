import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "PricingPlan",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("Subscription", SubscriptionSchema);
