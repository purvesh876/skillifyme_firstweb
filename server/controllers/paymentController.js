 import { razorpayInstance } from "../config/razorpay.js";
import { db } from "../config/firebase.js";
import crypto from "crypto";

// ✅ Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, userId = null, notes = {} } = req.body;

    if (!amount || isNaN(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: Number(amount) * 100, // convert INR → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes
    };

    const order = await razorpayInstance.orders.create(options);

    // ✅ Store order before payment
    await db.collection("orders").doc(order.id).set({
      orderId: order.id,
      amount: Number(amount),
      currency: order.currency,
      status: "created",
      userId,
      notes,
      createdAt: new Date()
    });

    return res.json({ success: true, order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Order creation failed" });
  }
};

// ✅ Verify Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields"
      });
    }

    // ✅ Step 1: Generate expected signature using secret key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // ✅ Step 2: Compare signatures
    if (expectedSignature !== razorpay_signature) {
      // ❌ Invalid signature
      await db
        .collection("orders")
        .doc(razorpay_order_id)
        .update({
          status: "failed",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          verifiedAt: new Date()
        });

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // ✅ Signature is valid → Mark payment as SUCCESS
    await db
      .collection("orders")
      .doc(razorpay_order_id)
      .update({
        status: "paid",
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        verifiedAt: new Date()
      });

    return res.json({
      success: true,
      message: "Payment verified successfully!"
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
