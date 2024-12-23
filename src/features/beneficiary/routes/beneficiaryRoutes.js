import express from "express";
import {
  createAssetRequest,
  updateAssetRequestStatus,
} from "../controllers/assetRequestController.js";
import { authenticateToken } from "../../donor/middelwere/authenticateToken.js";
import { addBeneficaryGstDetails } from "../controllers/addGstInfo.js";
import {
  getAllAssetRequests,
  getAllBeneficiary,
  getAssetRequestsByBeneficiary,
  getAssetRequestsById,
  getBeneficiaryById,
  getBeneficiaryDetails,
} from "../controllers/beneficiaryController.js";

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

router.get("/detail", authenticateToken, getBeneficiaryDetails);
router.get("/allBeneficiary", authenticateToken, getAllBeneficiary);
router.get("/allAssetsRequests", authenticateToken, getAllAssetRequests);
router.post("/getBeneficiaryById", authenticateToken, getBeneficiaryById);
router.get(
  "/getBeneficiaryRequestsById/:id",
  authenticateToken,
  getAssetRequestsByBeneficiary
);
router.get(
  "/getBeneficiaryRequestById/:id",
  authenticateToken,
  getAssetRequestsById
);
router.post("/createAssetRequest", authenticateToken, createAssetRequest);
router.post("/gstInfo/add", authenticateToken, addBeneficaryGstDetails); // Create request
router.post(
  "/acceptRequest/:requestId",
  authenticateToken,
  updateAssetRequestStatus
);

export default router;
