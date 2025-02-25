import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    donorName: String,
    donorEmail: String,
    laptopDetails: String,
    requestId: String,
    invoiceType: {
      type: String,
      enum: ["zero-value", "repair", "disposal"],
      required: true,
    },
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
