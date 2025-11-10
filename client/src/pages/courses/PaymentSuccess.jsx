import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";
import { generatePdf } from "./GeneratePdf";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuthUser();
  const { paymentId, totalAmount, cart } = location.state || {};

 const handleDownloadInvoice = async () => {
  if (!currentUser || !cart) return toast.error("Unable to generate invoice");
  await generatePdf(currentUser, cart, { paymentId, totalAmount });
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center">
        {paymentId ? (
          <>
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Payment Successful!</h2>
              <p className="text-gray-700">
                <strong>Transaction ID:</strong> {paymentId}
              </p>
              <p className="text-gray-700">
                <strong>Total Amount Paid:</strong> ₹{totalAmount}
              </p>
            </div>

            <div className="text-left mb-6">
              <h3 className="text-xl font-semibold mb-2">Courses Purchased:</h3>
              <ul className="list-disc list-inside space-y-1">
                {cart && cart.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{item.name}</span> — ₹{item.price} × {item.quantity || 1}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Download Invoice
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Go to Course
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Failed</h2>
            <p className="text-gray-700 mb-6">Something went wrong during payment.</p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800 transition duration-200"
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
