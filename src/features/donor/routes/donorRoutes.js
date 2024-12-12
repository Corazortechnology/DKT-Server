import express from "express";
import { upload } from "../../../middlewares/multer.js";
import {
  addProduct,
  getProductUploads,
} from "../controllers/addProductController.js";
import { createRequest } from "../controllers/createRequestController.js";
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
router.post("/add-product", upload.single("images"), addProduct);
router.get("/get-myUploads", getProductUploads);

router.post("/create-requests", createRequest); // Create request

export default router;
