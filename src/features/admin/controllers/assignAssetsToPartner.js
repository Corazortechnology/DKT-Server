import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import requestModel from "../../donor/models/requestModel.js";
import productModel from "../../donor/models/productModel.js";
import { sendEmail } from "../../../services/emailService.js";

const assignedAssetsToPartner = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { requestId,partnerId } = req.body;

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

    
    const request = await requestModel.findById(requestId).populate("products").populate("donor");
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Update request status and assign partner
    request.status = "Assigned";
    request.partner = partnerId;
    await request.save();

    // Update product statuses to "assigned"
    await productModel.updateMany(
      { _id: { $in: request.products.map((product) => product._id) } },
      { $set: { status: "Assigned" } }
    );

    await sendEmail(request.donor.email,"acceptDelevery",{address:request.address,pickupDate:request.shippingDate,requestId:request._id})


    res.status(201).json({
      message: "Partner assigned successfully!!",
      request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default assignedAssetsToPartner;
