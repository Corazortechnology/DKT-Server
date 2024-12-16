import express from "express";
import { upload } from "../../../middlewares/multer.js";
import {
  addProduct,
  getProductUploads,
} from "../controllers/addProductController.js";
import {
  createRequest,
  getRequests,
} from "../controllers/createRequestController.js";
import { getDonorDetails } from "../controllers/donorController.js";
import { authenticateToken } from "../middelwere/authenticateToken.js";
// import {
//   getAllDonors,
//   createDonor,
//   updateDonor,
//   deleteDonor,
// } from "../controllers/donorController.js";

const router = express.Router();

// // GET: Retrieve all donors
// router.get("/", getAllDonors);

// // POST: Add a new donor
// router.post("/", createDonor);

// // PUT: Update donor details
// router.put("/:id", updateDonor);

// // DELETE: Remove a donor
// router.delete("/:id", deleteDonor);


// Add product (Single with image upload, Bulk with URL)
// router.post("/add-product", authenticateToken, upload.single("image"), addProduct);

router.get("/",authenticateToken,getDonorDetails)
router.post("/add-product", upload.single("images"), addProduct);
router.get("/get-myUploads", getProductUploads);

router.post("/create-requests", createRequest); // Create request
router.get("/getrequests", getRequests); // Create request
export default router;
