import express from "express";
import { updateRequestedProductStatus } from "../controllers/updateRequestedProductStatus.js";
import { acceptRequest } from "../controllers/acceptRequestController.js";
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
router.post("/accept-request", acceptRequest);
router.get("/get-acceptedrequest", acceptRequest);

export default router;
