import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext.jsx";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();

  const totalQuantity = (cart || []).reduce(
    (sum, c) => sum + (c.quantity || 1),
    0
  );
  const totalPrice = (cart || []).reduce(
    (sum, c) => sum + (c.price || 0) * (c.quantity || 1),
    0
  );
  const payableAmount = Math.max((totalPrice - discountAmount) * 100, 100);

  // 🔹 Fetch user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        toast.error("Please login to continue");
        navigate("/login");
      } else {
        setUser(u);
        try {
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserDetails(userSnap.data());
          } else {
            console.warn("User info not found in Firestore.");
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 🔹 Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter a coupon code");

    try {
      const couponRef = doc(db, "coupons", couponCode.toUpperCase());
      const couponSnap = await getDoc(couponRef);

      if (!couponSnap.exists()) return toast.error("Invalid coupon code");

      const coupon = couponSnap.data();
      const now = new Date();
      const usedBy = coupon.usedBy || [];

      if (!coupon.isActive) return toast.error("This coupon is inactive");
      if (coupon.validTill?.toDate && now > coupon.validTill.toDate())
        return toast.error("Coupon expired");
      if (coupon.minPurchase && totalPrice < coupon.minPurchase)
        return toast.error(`Minimum purchase ₹${coupon.minPurchase} required`);
      if (coupon.usageLimit && usedBy.length >= coupon.usageLimit)
        return toast.error("Coupon usage limit reached");
      if (usedBy.includes(user?.uid))
        return toast.error("You have already used this coupon");

      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (totalPrice * coupon.discountValue) / 100;
      } else if (coupon.discountType === "flat") {
        discount = coupon.discountValue;
      }

      setAppliedCoupon({ ...coupon, code: couponCode.toUpperCase() });
      setDiscountAmount(discount);
      toast.success(`Coupon applied! You saved ₹${discount.toFixed(2)}`);
    } catch (err) {
      console.error(err);
      toast.error("Error validating coupon");
    }
  };

  // 🔹 Proceed to payment
  const proceedToPay = (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return toast.error("Your cart is empty!");
    if (!window.Razorpay) return toast.error("Razorpay SDK not loaded.");

    setProcessingPayment(true);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: payableAmount,
      currency: "INR",
      name: "IntelliLearn Courses",
      description: "Course purchase",
      handler: async (response) => {
        await handlePayment(response);
        setProcessingPayment(false);
      },
      prefill: {
        name: userDetails?.name || user?.displayName || "IntelliLearn User",
        email: userDetails?.email || user?.email || "",
        contact: userDetails?.contactNumber || "9999999999",
      },
      notes: {
        couponApplied: appliedCoupon?.code || "None",
        college: userDetails?.college || "N/A",
        degree: userDetails?.degree || "N/A",
        passoutYear: userDetails?.passoutYear || "N/A",
        dob: userDetails?.dob || "N/A",
        userId: user?.uid,
      },
      theme: { color: "#2874f0" },
      modal: {
      ondismiss: () => {
        setProcessingPayment(false);
        toast("Payment cancelled ❌", { icon: "🛑" });
      },
    }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response) => {
      toast.error("Payment failed!");
      setProcessingPayment(false);
    });

    razorpay.open();
  };

  // 🔹 Handle successful payment
  const handlePayment = async (response) => {
    console.log("✅ Payment Success:", response);
    setPaymentResponse(response);
    toast.success("Payment successful 🎉");

    try {
      const userCoursesRef = collection(db, "users", user.uid, "coursesPurchased");

      for (const course of cart) {
        await addDoc(userCoursesRef, {
          courseId: course.id,
          name: course.name,
          price: course.price,
          quantity: course.quantity || 1,
          paymentId: response.razorpay_payment_id,
          couponApplied: appliedCoupon?.code || null,
          discountAmount: discountAmount,
          purchasedAt: serverTimestamp(),
        });
      }

      // ✅ Mark coupon as used by user
      if (appliedCoupon?.code) {
        await updateDoc(doc(db, "coupons", appliedCoupon.code), {
          usedBy: arrayUnion(user.uid),
        });
      }

      // ✅ Clear cart
      if (typeof clearCart === "function") {
        clearCart();
      } else {
        cart.forEach((c) => removeFromCart(c.id));
      }

      navigate("/payment-success", {
        state: {
          paymentId: response.razorpay_payment_id,
          totalAmount: totalPrice,
          cart: cart,
        },
      });
    } catch (error) {
      console.error("Error saving purchase:", error);
      toast.error("Error saving course purchase!");
    }
  };

  // 🔹 Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 🔹 Redirect if cart empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      const timer = setTimeout(() => navigate("/courses"), 2500);
      return () => clearTimeout(timer);
    }
  }, [cart, navigate]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

        {cart && cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 🧾 Cart items */}
            <div className="md:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.category || "Course"} — Qty: {item.quantity || 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-blue-600">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </span>

                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success(`${item.name} removed from cart 🗑️`);
                      }}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 💳 Price summary */}
            <div className="border rounded-lg p-4 bg-gray-100">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                PRICE DETAILS
              </h4>

              <div className="flex justify-between text-sm mb-2">
                <span>
                  Price ({totalQuantity} {totalQuantity > 1 ? "items" : "item"})
                </span>
                <span>₹{totalPrice}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-700 text-sm mb-2">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold mt-4 border-t pt-2">
                <span>Total Payable</span>
                <span>₹{(totalPrice - discountAmount).toFixed(2)}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Apply
                </button>
              </div>

              <button
                onClick={proceedToPay}
                disabled={processingPayment}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {processingPayment ? "Processing..." : "Proceed to Pay"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10">
            <h3 className="text-2xl font-semibold mb-2">Your cart is empty.</h3>
            <button
              onClick={() => navigate("/courses")}
              className="text-blue-600 underline"
            >
              Go to Courses
            </button>
          </div>
        )}

        {paymentResponse && (
          <div className="mt-8 bg-green-50 border border-green-400 p-4 rounded-lg">
            <h3 className="text-green-700 font-semibold">
              Payment Successful 🎉
            </h3>
            <p className="text-sm text-gray-700">
              Payment ID: {paymentResponse.razorpay_payment_id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
