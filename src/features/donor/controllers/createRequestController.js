import mongoose from "mongoose";
import Donor from "../models/donorModel.js";
import requestModel from "../models/requestModel.js";
import jwt from "jsonwebtoken";
import productModel from "../models/productModel.js";

// export const createRequest = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     const { requestIds } = req.body;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.userId;

//     // Validate userId format
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid userId format" });
//     }

//     if (!requestIds || !requestIds.length) {
//       return res.status(400).json({ message: "Invalid input data" });
//     }

//     const donor = await Donor.findById(userId);
//     if (!donor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Donor not found" });
//     }

//     const request = await requestModel.create({
//       donor: donor._id,
//       products: requestIds,
//     });

//     res.status(201).json({
//       message: "Request and requested products created successfully",
//       request,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const createRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { requestIds, address, shippingDate, description } = req.body;

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

    // Check if all products exist and are available
    const products = await productModel.find({
      _id: { $in: requestIds },
      status: "available",
    });

    if (products.length !== requestIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some products are not available or do not exist",
      });
    }

    // Create the request
    const request = await requestModel.create({
      donor: donor._id,
      products: requestIds,
      address,
      shippingDate,
      description,
    });

    // Update the status of the products to "requested"
    await productModel.updateMany(
      { _id: { $in: requestIds } },
      { $set: { status: "requested" } }
    );

    res.status(201).json({
      message: "Change products status and Request created successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDonerRequests = async (req, res) => {
  try {
   
    const requestedProducts = await requestModel
      .find({ donor: req.userId })
      .populate("donor")
      .populate("partner")
      .populate("products").sort({updatedAt:-1});

    res.status(200).json({
      success: true,
      data: requestedProducts,
      message: "requests found successfully!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getDonerRequestsById = async (req, res) => {
  try {
    const {donerId} = req.body;
    const requestedProducts = await requestModel
      .find({ donor:donerId })
      .populate("donor")
      .populate("partner")
      .populate("products").sort({updatedAt:-1});

    res.status(200).json({
      success: true,
      data: requestedProducts,
      message:"requests found successfully!!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}; 
export const getDonerRequestsBy_Id = async (req, res) => {
  try {
    const {requestId} = req.body;
    const requestedProducts = await requestModel
      .find({ _id:requestId })
      .populate("donor")
      .populate("partner")
      .populate("products").sort({updatedAt:-1});

    res.status(200).json({
      success: true,
      data: requestedProducts,
      message:"requests found successfully!!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}; 

export const getAllRequests = async (req, res) => {
  try {
    // Fetch all requests with the status "requested"
    const requestedProducts = await requestModel
      .find()
      .populate("donor")
      .populate("partner")
      .populate("products").sort({updatedAt:-1});

    res.status(200).json({
      success: true,
      data: requestedProducts,
      message: "getting requests successfully!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getRequests = async (req, res) => {
  try {
    // Fetch all requests with the status "requested"
    const requestedProducts = await requestModel
      .find({ status: "requested" })
      .populate("donor")
      .populate("partner")
      .populate("products").sort({updatedAt:-1});

    res.status(200).json({
      success: true,
      data: requestedProducts,
      message: "requests found successfully!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAcceptedRequests = async (req, res) => {
  try {
    // Fetch all requests with the status "requested"
    const requestedProducts = await requestModel
      .find({ status: "assigned" })
      .populate("donor")
      .populate("partner")
      .populate("products");

    res.status(200).json({
      success: true,
      data: requestedProducts,
      message: "requests found successfully!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
