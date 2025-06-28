import express from "express";
import {
  getAllVendor,
  getVendorById,
  getVendorDetails,
} from "../controllers/vendorController.js";
import { authenticateToken } from "../../donor/middelwere/authenticateToken.js";

const router = express.Router();

router.get("/", authenticateToken, getVendorDetails);
// router.put("/requested-products/status", updateRequestedProductStatus);
// router.post("/accept-request", handleDeleveryRequest);
// router.get("/get-acceptedrequest", handleDeleveryRequest);
// router.get("/assetDeleveryRequest",authenticateToken,getAssetDeleveryRequest)
// router.get("/assetRequest",authenticateToken,getAssetDeleveryRequestforPartner)
// router.get("/assetDelevery",authenticateToken,getAllAssetDeliveries)
// router.post("/acceptAssetDeleveryRequest",authenticateToken,acceptOrRejectAssetDelevery)
// router.post("/updateAssetCondition",authenticateToken,updateAssetCondition)
// for admin
router.get("/allPartner", authenticateToken, getAllVendor);
router.post("/getPartnerById", authenticateToken, getVendorById);
//partner req by partner id
// router.post("/getPartnerRequestById",authenticateToken,getPartnerRequestsById)
//partner req by request id
// router.post("/getPartnerRequestBy_Id",authenticateToken,getPartnerRequestsBy_Id)
// partner asset delevery request
// router.post("/getPartnerAssetDeleveryRequestBy_Id",authenticateToken,getAssetDeleveryRequestBy_PartnerId)

//adding gst rout
// router.post("/gstInfo/add", authenticateToken, addGstDetails);
// router.post("/addAdress", authenticateToken, addAddress);
export default router;
