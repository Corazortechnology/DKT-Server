import assetDelevery from "../models/assetDelevery.js";


export const getAllAssetDeliveries = async (req, res) => {
    try {
        // Retrieve all asset deliveries and populate referenced fields
        const deliveries = await assetDelevery
            .find()
            .populate("beneficeryRequestId") // Populate beneficeryRequestId
            .populate("assetId") // Populate assetId
            .populate("partnerId"); // Populate partnerId

        // Check if no deliveries were found
        if (!deliveries || deliveries.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No asset delivery requests found.",
            });
        }

        // Send a successful response with the data
        res.status(200).json({
            success: true,
            data: deliveries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error.",
            error: error.message, // Include the error message for debugging purposes
        });
    }
};
