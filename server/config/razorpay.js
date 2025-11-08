// console.log("Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log("Key Secret:", process.env.RAZORPAY_KEY_SECRET);

// import Razorpay from "razorpay";

// export const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });


// export const razorpayInstance = {
//   orders: {
//     create: () => {
//       throw new Error("Razorpay keys not configured yet");
//     }
//   }
// };

import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
console.log("Loaded Razorpay Key:", process.env.RAZORPAY_KEY_ID);

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
