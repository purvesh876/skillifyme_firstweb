// import { useState } from "react";
// import axios from "axios";

// const API = "http://localhost:4000/api/payment";

// export default function RazorpayCheckout() {
//   const [amount, setAmount] = useState(200);
//   const [loading, setLoading] = useState(false);

//   // ✅ Load Razorpay script dynamically
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     setLoading(true);

//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       alert("Failed to load Razorpay SDK");
//       return;
//     }

//     try {
//       // ✅ Step 1: Create order on backend
//       const { data } = await axios.post(`${API}/create-order`, { amount });

//       if (!data.success) {
//         alert("Order creation failed");
//         return;
//       }

//       const order = data.order;

//       // ✅ Step 2: Configure Razorpay Checkout
//       const options = {
//         key: "rzp_test_RdFn7w18bcdjeg", // ✅ Replace with your TEST KEY_ID
//         currency: order.currency,
//         amount: order.amount,
//         order_id: order.id,
//         name: "Skillify Payment",
//         description: "Course Payment",
//         theme: {
//           color: "#5b24ff",
//         },

//         // ✅ Step 3: After payment success → verify backend
//         handler: async function (response) {
//           const verifyRes = await axios.post(`${API}/verify-payment`, response);

//           if (verifyRes.data.success) {
//             alert("✅ Payment Successful!");
//           } else {
//             alert("❌ Payment Verification Failed!");
//           }
//         },

//         // ✅ Pre-filled details (optional)
//         prefill: {
//           name: "Test User",
//           email: "test@example.com",
//           contact: "",
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       // Optional: Payment failure listener
//       rzp.on("payment.failed", function () {
//         alert("❌ Payment Failed!");
//       });

//       // ✅ Step 4: Open payment popup
//       rzp.open();
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Razorpay Checkout</h2>

//       <label style={styles.label}>Enter Amount (₹)</label>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         style={styles.input}
//       />

//       <button
//         onClick={handlePayment}
//         style={styles.button}
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Pay Now"}
//       </button>
//     </div>
//   );
// }

// // ✅ Simple CSS-in-JS styles
// const styles = {
//   container: {
//     padding: 20,
//     width: 350,
//     margin: "40px auto",
//     background: "#fff",
//     borderRadius: 12,
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     fontFamily: "Arial",
//   },
//   title: {
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   label: {
//     fontWeight: "bold",
//     display: "block",
//   },
//   input: {
//     width: "100%",
//     padding: 12,
//     marginTop: 10,
//     marginBottom: 20,
//     borderRadius: 6,
//     border: "1px solid #ccc",
//     fontSize: 16,
//   },
//   button: {
//     width: "100%",
//     padding: 12,
//     background: "#5b24ff",
//     color: "white",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// };



import { useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api/payment";

export default function RazorpayCheckout() {
  const [amount, setAmount] = useState(200);
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const { data } = await axios.post(`${API}/create-order`, { amount });

      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      const order = data.order;

      const options = {
        key: "rzp_test_RdHaw7r1INKzH0", // ✅ Your test key
        currency: order.currency,
        amount: order.amount,
        order_id: order.id,
        name: "Skillify Payment",
        description: "Course Payment",

        theme: { color: "#5b24ff" },

        // ✅ FIX: Disable Razorpay login
        modal: {
          confirm_close: true,
          animation: true
        },

        // ✅ FIX: Force card-only test mode (no login)
        config: {
          display: {
            blocks: {
              card: {
                name: "Pay Using Card",
                instruments: [{ method: "card" }]
              }
            },
            sequence: ["block.card"],
            preferences: {
              show_default_blocks: false
            }
          }
        },

        handler: async function (response) {
          const verifyRes = await axios.post(`${API}/verify-payment`, response);
          if (verifyRes.data.success) {
            alert("✅ Payment Successful!");
          } else {
            alert("❌ Payment Verification Failed!");
          }
        },

        // ✅ FIX: Remove phone number login
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "" 
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("❌ Payment Failed!");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Razorpay Checkout</h2>

      <label style={styles.label}>Enter Amount (₹)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={handlePayment}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    width: 350,
    margin: "40px auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    display: "block",
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#5b24ff",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },
};
