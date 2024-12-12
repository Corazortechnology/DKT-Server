import partnerModel from "../../partner/models/partnerModel.js";
import mongoose from "mongoose";
import requestedProductModel from "../../partner/models/requestedProductModel.js";
import Donor from "../models/donorModel.js";
import requestModel from "../models/requestModel.js";
import jwt from "jsonwebtoken";

export const createRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { requestIds } = req.body;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format" });
    }


    if (!requestIds || !requestIds.length) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const donor = await Donor.findById(userId);
    if (!donor) {
      return res
        .status(404) 
        .json({ success: false, message: "Donor not found" });
    }

    if (!donor) {
      return res.status(404).json({ message: "Donor or Partner not found" });
    }

    const request = await requestModel.create({
      donor: donor._id,
      products: requestIds,
    });

    const requestedProducts = requestIds.map((productId) => ({
      requestId: request._id,
      productId,
      donorId:donor._id,
      status: "requested",
    }));

    await requestedProductModel.insertMany(requestedProducts);

    await Donor.updateMany(
      { _id: donor._id, "products._id": { $in: requestIds } },
      { $set: { "products.$[prod].status": "requested" } },
      { arrayFilters: [{ "prod._id": { $in: requestIds } }] }
    );

    res.status(201).json({
      message: "Request and requested products created successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
