import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import requestModel from "../../donor/models/requestModel.js";
import productModel from "../../donor/models/productModel.js";
import { sendEmail } from "../../../services/emailService.js";
import axios from "axios";
import partnerModel from "../../partner/models/partnerModel.js";

let shipRocketToken = null;
let shipRocketTokenExpiry = null;

// Fetch ShipRocket Token
const fetchShipRocketToken = async () => {
  try {
    // Check if the token exists and is not expired
    if (shipRocketToken && shipRocketTokenExpiry > Date.now()) {
      console.log("Using existing valid ShipRocket token");
      return shipRocketToken;
    }

    console.log("Fetching a new ShipRocket token");
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      const { token, expires_in } = response.data;

      shipRocketToken = token;
      shipRocketTokenExpiry = Date.now() + expires_in * 1000; // Convert expires_in seconds to milliseconds

      return shipRocketToken;
    } else {
      throw new Error("Failed to authenticate with ShipRocket");
    }
  } catch (error) {
    console.error("Error fetching ShipRocket token:", error.message);
    throw new Error("ShipRocket authentication failed");
  }
};

// Controller Function
const assignedAssetsToPartner = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { requestId, partnerId,pickupAddress } = req.body;
    const address = pickupAddress.address.split(",")
    console.log(address)
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format" });
    }

    const request = await requestModel
      .findById(requestId)
      .populate("products")
      .populate("donor");
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }


    // Update request status and assign partner
    request.status = "Assigned";
    request.partner = partnerId;
    await request.save();

    // Update product statuses to "Assigned"
    await productModel.updateMany(
      { _id: { $in: request.products.map((product) => product._id) } },
      { $set: { status: "Assigned" } }
    );

    // Fetch ShipRocket token if not available
    const tokenn = await fetchShipRocketToken();
    const partner = await partnerModel.findById(partnerId);
    console.log(partner)
    // Create an order in ShipRocket
    const shiprocketResponse = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: request._id,
        order_date: new Date().toISOString(),
        pickup_location: pickupAddress?.shiprocketPickupDetails?.pickup_code,
        channel_id: "",
        comment: "Handle with care",
        reseller_name: request.donor.companyName,
        company_name: request.donor.companyName || "Default Company",
        billing_customer_name: request.donor.companyName || "John",
        billing_last_name: "",
        billing_address: request.address || "Default Address",
        billing_address_2: "",
        billing_isd_code: "+91",
        billing_city: request.city,
        billing_pincode: request.pincode,
        billing_state: request.state,
        billing_country: "India",
        billing_email: request.donor.email,
        billing_phone: request.phone,
        billing_alternate_phone: request.alternatePhone,
        shipping_is_billing: true,
        shipping_customer_name: partner.partnerName || "John",
        shipping_last_name: "",
        shipping_address: address[0] || "Default Address",
        shipping_address_2: "",
        shipping_city: address[1].trim() || "New Delhi",
        shipping_pincode: address[3].trim() || "110001",
        shipping_country: "India",
        shipping_state: address[2].trim(),
        shipping_email: partner.email || "example@example.com",
        shipping_phone:"9876543210",
        order_items: request.products.map((product) => ({
          name: product.name,
          sku: product.model || "Default-SKU",
          units: product.quantity,
          selling_price: product.orignalPurchaseValue || "5000",
          discount: "100",
          tax: "18",
          hsn: "84713010",
        })),
        payment_method: "Prepaid",
        shipping_charges: "500",
        giftwrap_charges: "50",
        transaction_charges: "100",
        total_discount: "500",
        sub_total: "10000",
        length: request.dimensions.length,
        breadth: request.dimensions.breadth,
        height: request.dimensions.height,
        weight: request.dimensions.weight,
        ewaybill_no: "EWB123456789",
        customer_gstin: "29ABCDE1234F2Z5",
        invoice_number: "INV987654321",
        order_type: "ESSENTIALS",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${shipRocketToken}`,
        },
      }
    );

    if (shiprocketResponse.status !== 200) {
      throw new Error("Failed to create order in ShipRocket");
    }
    console.log(shiprocketResponse)
    // Append shipping details to the request
    request.shippingDetails = shiprocketResponse.data;
    await request.save();

    // Notify donor about the assignment
    await sendEmail(request.donor.email, "acceptDelevery", {
      address: request.address,
      pickupDate: request.shippingDate,
      requestId: request._id,
    });

    res.status(201).json({
      success: true,
      message: "Partner assigned and ShipRocket order created successfully!",
      request,
      shiprocketResponse: shiprocketResponse.data,
    });
  } catch (error) {
    console.error("Error:", error.message);
    if (error.message.includes("ShipRocket authentication failed")) {
      shipRocketToken = null; // Reset token on failure
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export default assignedAssetsToPartner;
