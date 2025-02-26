import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Subscription } from '../models/subscriptionModel.js';
import donorModel from '../models/donorModel.js';

// Load environment variables
dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECURITY_KEY,
});

export const checkout = async (req, res) => {
    const { amount, period, plan } = req.body;
    const userId = req.userId
    const isUser = await donorModel.findById(userId);

    const options = {
        amount: Number(amount * 100),  // amount in the smallest currency unit
        currency: "INR",
    };

    try {
        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            data: order,
            userId,
            period, 
            plan,
            userName:isUser.userName,
            userEmail: isUser.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error });
    }
};



// Utility function to calculate end date based on the subscription type
const calculateEndDate = (startDate, type) => {
    const startTimestamp = new Date(startDate).getTime();

    if (type === 'Monthly') {
        // Number of milliseconds in one month (assuming an average month length of 30.44 days)
        const oneMonthInMilliseconds = 30.44 * 24 * 60 * 60 * 1000;
        const endTimestamp = startTimestamp + oneMonthInMilliseconds;
        return new Date(endTimestamp);
    } else if (type === 'Yearly') {
        // Number of milliseconds in one year (using 365.25 days to account for leap years)
        const oneYearInMilliseconds = 365.25 * 24 * 60 * 60 * 1000;
        const endTimestamp = startTimestamp + oneYearInMilliseconds;
        return new Date(endTimestamp);
    }
    // Return null or handle invalid type cases
    return null;
};

export const paymentVarification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, userId, period, plan } = req.body;
 
  
    try {
      if (!process.env.RAZORPAY_SECURITY_KEY) {
        return res.status(500).json({ success: false, message: "Razorpay security key not set." });
      }
  
      // ✅ Generate Expected Signature
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECURITY_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      console.log("Expected Sign:", expectedSign, "Received:", razorpay_signature);
  
      if (expectedSign !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid Payment Verification!" });
      }
  
      // ✅ Create Subscription if signature matches
      const subscriptionStartDate = new Date();
      const subscriptionEndDate = calculateEndDate(subscriptionStartDate, period);
  
      const newSubscription = new Subscription({
        user: userId,
        plan,
        amount,
        period,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        status: "Active",
        paymentDetails: {
          method: "Credit Card",
          transactionId: razorpay_payment_id,
        },
      });
  
      await newSubscription.save();
  
      // ✅ Update user subscription
      const isUser = await donorModel.findById(userId);
      if (!isUser) {
        return res.status(404).json({ success: false, message: "No user found!" });
      }
  
      isUser.subscription = newSubscription._id;
      await isUser.save();
  
      return res.status(201).json({
        success: true,
        message: "Subscription created successfully!",
        data: {
          paymentId: razorpay_payment_id,
          amount,
          plan,
          duration: period,
          expireOn: subscriptionEndDate.toISOString(),
        },
      });
  
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
  };
  

