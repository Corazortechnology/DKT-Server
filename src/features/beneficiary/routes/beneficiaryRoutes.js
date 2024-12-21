import express from "express";
import { createAssetRequest } from "../controllers/assetRequestController.js";
import { authenticateToken } from "../../donor/middelwere/authenticateToken.js";
import { addBeneficaryGstDetails } from "../controllers/addGstInfo.js";
// import {
//   getBeneficiaries,
//   createBeneficiary,
// } from "../controllers/beneficiaryController.js";

const router = express.Router();

// // GET: Retrieve all beneficiaries
// router.get('/', getAllBeneficiaries);

// // POST: Create a new beneficiary
// router.post('/', createBeneficiary);

// // PUT: Update a specific beneficiary
// router.put('/:id', updateBeneficiary);

// // DELETE: Delete a specific beneficiary
// router.delete('/:id', deleteBeneficiary);

router.post("/createAssetRequest",authenticateToken,createAssetRequest);
router.post("/gstInfo/add", authenticateToken, addBeneficaryGstDetails); // Create request

export default router;
