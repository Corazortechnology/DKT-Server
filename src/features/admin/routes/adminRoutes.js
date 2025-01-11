import express from "express";
import { authenticateToken } from "../../donor/middelwere/authenticateToken.js";
import { getAllReports } from "../../beneficiary/controllers/reportController.js";
import { approveOrRejetUploads } from "../controllers/approveOrRejectUploads.js";
import { approveUser } from "../controllers/approvedOrRejectUser.js";
import assignedAssetsToBeneficiary from "../controllers/assigendAssetsToBeneficiary.js";
import { assetAcceptOrReject } from "../controllers/assetController.js";
import { creatAssetDeleveryRequest } from "../controllers/creatAssetDeleveryRequest.js";
// import {
//   getAllAdmins,
//   createAdmin,
//   updateAdmin,
//   deleteAdmin,
// } from "../controllers/adminController.js";

const router = express.Router();

// // GET: Retrieve all admins
// router.get("/", getAllAdmins);

// // POST: Add a new admin
// router.post("/", createAdmin);

// // PUT: Update admin details
// router.put("/:id", updateAdmin);

// // DELETE: Remove an admin
// router.delete("/:id", deleteAdmin);

router.get("/reports", authenticateToken, getAllReports);

router.post(
  "/approveOrRejectAssetUploads",
  authenticateToken,
  approveOrRejetUploads
);
router.post("/approveOrRejectUsers", approveUser);
router.post("/assignedAssetsToBeneficiary", assignedAssetsToBeneficiary);

//assets request managment
//asset accept or rejet
router.post("/acceptOrRejectAssetRequest", authenticateToken, assetAcceptOrReject);

// create asset delevery request for partner
router.post("/creatAccetDeleveryRequest", authenticateToken, creatAssetDeleveryRequest);

export default router;
