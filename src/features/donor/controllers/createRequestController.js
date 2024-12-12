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

    const request = await requestModel.create({
      donor: donor._id,
      products: requestIds,
    });

    res.status(201).json({
      message: "Request and requested products created successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRequests = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    // Verify the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const donorId = decoded.userId;

    // Validate donorId format
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
      return res.status(400).json({ success: false, message: "Invalid donorId format" });
    }

    // Find all requests associated with the donor
    const requests = await Request.find({})
    .populate("donor")
      .populate("partner") // Populate partner details
      .populate("products") // Populate product details
      .sort({ createdAt: -1 }); // Sort by newest first

    if (requests.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No requests found for the donor" });
    }
    const requestedRequest = requests.filter((ele)=>{
      return ele.status == "requested" 
    })
    // Respond with the requests
    res.status(200).json({
      success: true,
      message: "Requests retrieved successfully",
      requests:requestedRequest,
    });
  } catch (error) {
    console.error("Error retrieving requests:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
