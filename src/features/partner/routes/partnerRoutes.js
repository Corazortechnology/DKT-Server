import express from "express";
import { updateRequestedProductStatus } from "../controllers/updateRequestedProductStatus.js";
import { handleDeleveryRequest } from "../controllers/acceptRequestController.js";
import { authenticateToken } from "../../donor/middelwere/authenticateToken.js";
import { getAllPartner, getPartnerById, getPartnerRequestsById, getPartnerRequestsBy_Id } from "../controllers/partnerController.js";
import { getAssetDeleveryRequest } from "../controllers/getAssetDeleveryRequest.js";
import { acceptOrRejectAssetDelevery } from "../controllers/acceptOrRejectAssetDelevery.js";
import { getAllAssetDeliveries } from "../controllers/assetDelevery.js";
// import {
//   getAllPartners,
//   createPartner,
//   updatePartner,
//   deletePartner,
// } from "../controllers/partnerController.js";

const router = express.Router();

// // GET: Retrieve all partners
// router.get("/", getAllPartners);

// // POST: Add a new partner
// router.post("/", createPartner);
 
// // PUT: Update partner details
// router.put("/:id", updatePartner);

// // DELETE: Remove a partner
// router.delete("/:id", deletePartner);

router.put("/requested-products/status", updateRequestedProductStatus);
router.post("/accept-request", handleDeleveryRequest);
router.get("/get-acceptedrequest", handleDeleveryRequest);
router.get("/assetDeleveryRequest",authenticateToken,getAssetDeleveryRequest)
router.get("/assetDelevery",authenticateToken,getAllAssetDeliveries)
router.post("/acceptAssetDeleveryRequest",authenticateToken,acceptOrRejectAssetDelevery)
// for admin 
router.get("/allPartner",authenticateToken,getAllPartner)
router.post("/getPartnerById",authenticateToken,getPartnerById)
//partner req by partner id 
router.post("/getPartnerRequestById",authenticateToken,getPartnerRequestsById)
//partner req by request id 
router.post("/getPartnerRequestBy_Id",authenticateToken,getPartnerRequestsBy_Id)
export default router;
