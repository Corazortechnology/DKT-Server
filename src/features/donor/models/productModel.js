import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Product name
    description: { type: String, required: true }, // Product description
    category: { type: String, required: true }, // Product category (e.g., electronics, furniture)
    condition: {
        type: String,
        required: true,
        enum: ["New", "Used", "Refurbished"], // Product condition
    },
    images: [{ type: String }], // Array of image URLs or paths
    quantity: { type: Number, required: true, min: 1 }, // Quantity of items
    createdAt: { type: Date, default: Date.now }, // Timestamp
});

const productUploadSchema = new mongoose.Schema(
    {
        donatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor',  // Reference to the Company model (or your donor model)
            required: true
        },
        donationDetails: {
            type: String,
            required: false // Optional details about the donation
        },
        products: [productSchema], // Array of products added by the donor

    },
    {
        timestamps: true // Auto-created createdAt and updatedAt fields
    }
);

export default mongoose.model('ProductUpload', productUploadSchema);