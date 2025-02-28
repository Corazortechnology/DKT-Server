import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, // ✅ Reference PricingPlan
    ref: "Request"},
    subscription:{type: mongoose.Schema.Types.ObjectId, // ✅ Reference PricingPlan
    ref: "PricingPlan"},
    invoiceType: {
      type: String,
      enum: ["zero-value", "repair", "disposal"],
      required: true,
    },
    platformFee:{type:Number},
    logisticsFee:{type:Number},
    transactionFee:{type:Number},
    serviceFee:{type:Number},
    gstNumber: String,
    invoiceAmount: { type: Number, default: 0 },
    gstApplicable: { type: Boolean, default: false },
    itcClaimable: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["generated", "approved", "archived"],
      default: "generated",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
