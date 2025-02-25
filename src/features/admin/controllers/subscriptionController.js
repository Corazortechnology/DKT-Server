
import subscriptionModel from "../models/subscriptionModel.js";
// Create a new subscription (User subscribes)

// POST /api/v1/subscriptions
export const createSubscription = async (req, res) => {
  try {
    // Assuming authentication middleware sets req.user
    const userId = req.userId || req.body.user;
    const { planId, paymentId, orderId } = req.body;

    if (!userId || !planId || !paymentId || !orderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create subscription (you may choose to start with "pending" and update later)
    const newSubscription = new subscriptionModel({
      user: userId,
      planId,
      paymentId,
      orderId,
      status: "active", // Or "pending", then update upon verification
    });

    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the current subscription for the logged in user
// GET /api/v1/subscriptions/current
export const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Get the most recent subscription for the user
    const subscription = await subscriptionModel
      .findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate("planId");
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get a subscription by its ID
// GET /api/v1/subscriptions/:id
export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await subscriptionModel
      .findById(req.params.id)
      .populate("user")
      .populate("planId");
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all subscriptions
// GET /api/v1/subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel
      .find()
      .populate("user")
      .populate("planId");
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update a subscription (e.g. update status)
// PUT /api/v1/subscriptions/:id
export const updateSubscription = async (req, res) => {
  try {
    const { status } = req.body;
    const subscription = await subscriptionModel
      .findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("user")
      .populate("planId");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a subscription
// DELETE /api/v1/subscriptions/:id
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionModel.findByIdAndDelete(
      req.params.id
    );
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
