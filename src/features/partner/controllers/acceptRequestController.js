import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import partnerModel from "../models/partnerModel.js";
import requestModel from "../../donor/models/requestModel.js";
import productModel from "../../donor/models/productModel.js";

export const acceptRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const partnerId = decoded.userId;

    // Validate partnerId format
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid partnerId format" });
    }

    const partner = await partnerModel.findById(partnerId);
    if (!partner) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    const { requestId } = req.body;

    // Validate requestId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid requestId format" });
    }

    const request = await requestModel.findById(requestId).populate("products");
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "requested") {
      return res.status(400).json({
        success: false,
        message: "Request is not in a state that can be accepted",
      });
    }

    // Update request status and assign partner
    request.status = "assigned";
    request.partner = partnerId;
    await request.save();

    // Update product statuses to "assigned"
    await productModel.updateMany(
      { _id: { $in: request.products.map((product) => product._id) } },
      { $set: { status: "assigned" } }
    );

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};