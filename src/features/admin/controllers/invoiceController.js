import requestModel from "../../donor/models/requestModel.js";
import Invoice from "../models/Invoice.js";

// Generate Invoice (Zero-Cost Donation)
export const generateInvoice = async (req, res) => {
  try {
    const { requestId, donorName, donorEmail, laptopDetails, gstNumber } =
      req.body;

    const newInvoice = new Invoice({
      donorName,
      donorEmail,
      laptopDetails: laptopDetails
        .map((p) => `${p.name} (${p.quantity})`)
        .join(", "),
      requestId,
      invoiceType: "zero-value",
      gstNumber,
      invoiceAmount: 0,
      gstApplicable: false,
      itcClaimable: false,
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Invoices
export const getAllInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Invoices
export const getInvoiceByrequestId = async (req, res) => {
  try {
    const { requestId } = req.params;

    const invoices = await Invoice.find({ requestId });

    if (!invoices.length) {
      return res
        .status(404)
        .json({ message: "No invoices found for this request" });
    }

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Repair Invoice
export const addRepaireInvoice = async (req, res) => {
  try {
    const {
      vendorName,
      requestId,
      invoiceAmount,
      gstNumber,
      // donorEmail,
      laptopDetails,
    } = req.body;
    const newInvoice = new Invoice({
      donorName: vendorName,
      // donorEmail,
      requestId,
      laptopDetails: laptopDetails,
      invoiceType: "repair",
      gstNumber,
      invoiceAmount,
      gstApplicable: true,
      itcClaimable: true,
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Generate Allocation doc
export const generateAllocationDoc = async (req, res) => {
  try {
    const { beneficiaryName, laptopDetails } = req.body;

    const doc = {
      beneficiaryName,
      laptopDetails,
      allocationDate: new Date(),
      status: "allocated",
    };

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Add Disposal Invoice
export const addDisposalDoc = async (req, res) => {
  try {
    const { disposalVendor, invoiceAmount, gstNumber } = req.body;

    const newInvoice = new Invoice({
      donorName: disposalVendor, // Vendor acts as donor in invoice system
      invoiceType: "disposal",
      gstNumber,
      invoiceAmount,
      gstApplicable: invoiceAmount > 0, // GST only if charged
      itcClaimable: false,
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
