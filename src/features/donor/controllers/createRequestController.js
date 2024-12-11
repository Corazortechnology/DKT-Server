import partnerModel from "../../partner/models/partnerModel.js";
import requestedProductModel from "../../partner/models/requestedProductModel.js";
import donorModel from "../models/donorModel.js";
import requestModel from "./requestModel.js";

export const createRequest = async (req, res) => {
  try {
    const { donorId, partnerId, requestIds } = req.body;

    if (!donorId || !partnerId || !requestIds || !requestIds.length) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const donor = await donorModel.findById(donorId);
    const partner = await partnerModel.findById(partnerId);

    if (!donor || !partner) {
      return res.status(404).json({ message: "Donor or Partner not found" });
    }

    const request = await requestModel.create({
      donor: donorId,
      partner: partnerId,
      products: requestIds,
    });

    const requestedProducts = requestIds.map((productId) => ({
      requestId: request._id,
      productId,
      donorId,
      partnerId,
      status: "requested",
    }));

    await requestedProductModel.insertMany(requestedProducts);

    await donorModel.updateMany(
      { _id: donorId, "products._id": { $in: requestIds } },
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
