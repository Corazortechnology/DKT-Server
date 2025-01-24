import productModel from "../../donor/models/productModel.js";

export const updateAssetCondition = async (req, res) => {
  const { productId, condition } = req.body;

  // Validate the input
  if (!productId || !condition) {
    return res.status(400).json({
      success: false,
      message: "Product ID and condition are required.",
    });
  }

  try {
    // Check if the provided condition is valid
    // const validConditions = ["Recycle", "Reuse", "Refurbished"];
    // if (!validConditions.includes(condition)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid condition provided.",
    //   });
    // }

    // Find and update the product's condition
    const product = await productModel.findByIdAndUpdate(
      productId,
      { condition },
      { new: true, runValidators: true } // Return the updated document and validate the input
    );

    // If product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Respond with the updated product
    res.status(200).json({
      success: true,
      message: "Product condition updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product condition:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product condition.",
    });
  }
};
