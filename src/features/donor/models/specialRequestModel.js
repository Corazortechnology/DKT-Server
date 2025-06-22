import mongoose from "mongoose";

const specialRequestSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    donationFields: [
      {
        type: String,
        required: true,
        enum: ["money", "food", "clothes", "books", "services", "other"],
      },
    ],
    donationRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    donorNote: {
      type: String, // optional note from admin
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    requestedAmount: {
      type: Number, // amount admin requests from donor if accepted
    },
    adminNote: {
      type: String, // optional note from admin
    },
    decisionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // optional: track which admin accepted/rejected
    },
    agreementCreated: {
      type: Boolean,
      default: false,
    },
    paymentDetail: {
      status: {
        type: String,
        enum: ["Active", "Expired", "Canceled", "Pending"],
        default: "Pending",
      },
      paid: {
        type: Boolean,
        default: false,
      },
      transactionId: {
        type: String,
      },
      paymentMethod: {
        type: String,
        enum: [
          "Credit Card",
          "PayPal",
          "Bank Transfer",
          "UPI",
          "RazorPay",
          "Other",
        ],
        default: "RazorPay",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      fundTransferDate: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);


export default mongoose.model("SpecialRequest", specialRequestSchema);
