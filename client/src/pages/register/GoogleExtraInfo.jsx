import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import toast, { Toaster } from "react-hot-toast";

function GoogleExtraInfo() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactNumber: "",
    dob: "",
    college: "",
    degree: "",
    passoutYear: "",
  });
  const [isDisabled, setDisabled] = useState(false);

  if (!state) {
    navigate("/login"); 
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setDisabled(true);

  try {
   
    const hasEmpty = Object.values(formData).some(
      (v) => !v || String(v).trim() === ""
    );
    if (hasEmpty) {
      toast.error("All fields are required!");
      setDisabled(false);
      return;
    }

    if (!state || !state.uid) {
      toast.error("User data missing. Please login again.");
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", state.uid);
    const userSnap = await getDoc(userRef);
    let existingData = {};

    if (userSnap.exists()) {
      existingData = userSnap.data(); 
    }

    
    const payload = {
      ...existingData, 
      contactNumber: formData.contactNumber,
      dob: formData.dob,
      college: formData.college,
      degree: formData.degree,
      passoutYear: formData.passoutYear,
      updatedAt: serverTimestamp(), 
    };

    await setDoc(userRef, payload, { merge: true }); 

    toast.success("Account completed successfully!");
    navigate("/courses");
  } catch (err) {
    console.error("Failed to save extra info:", err);
    toast.error("Failed to save extra info: " + (err.message || "Unknown error"));
  } finally {
    setDisabled(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-6 py-10">
      <Toaster position="top-center" />
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-teal-400">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="p-2 rounded-lg bg-gray-700 border border-teal-500"
            required
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="p-2 rounded-lg bg-gray-700 border border-teal-500"
            required
          />
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="College"
            className="p-2 rounded-lg bg-gray-700 border border-teal-500"
            required
          />
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree"
            className="p-2 rounded-lg bg-gray-700 border border-teal-500"
            required
          />
          <input
            type="number"
            name="passoutYear"
            value={formData.passoutYear}
            onChange={handleChange}
            placeholder="Passout Year"
            className="p-2 rounded-lg bg-gray-700 border border-teal-500"
            required
          />
          <button
            type="submit"
            disabled={isDisabled}
            className={`bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-semibold transition ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDisabled ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GoogleExtraInfo;
