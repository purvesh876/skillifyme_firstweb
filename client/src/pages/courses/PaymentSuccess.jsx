import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const { paymentId, totalAmount, cart } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg text-center">
        {paymentId ? (
          <>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              🎉 Payment Successful!
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Transaction ID:</strong> {paymentId}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Total Amount:</strong> ₹{totalAmount}
            </p>

            <h3 className="text-xl font-semibold mb-3">Courses Purchased:</h3>
            <ul className="text-left list-disc list-inside mb-6">
              {cart && cart.map((item, idx) => (
                <li key={idx}>
                  {item.name} — ₹{item.price}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Go to Home
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              ❌ Payment Failed
            </h2>
            <p className="text-gray-700 mb-6">
              Something went wrong during payment.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
