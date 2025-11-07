import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

function RegisterPage() {
  const { currentUser, loading, registerWithEmail, signInWithGoogle } = useAuthUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    dob: "",
    college: "",
    degree: "",
    passoutYear: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isDisabled, setDisabled] = useState(false);


  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/courses");
    }
  }, [currentUser, loading, navigate]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setDisabled(true);

    
    if (Object.values(formData).some((v) => v.trim() === "")) {
      toast.error("All fields are required!");
      setDisabled(false);
      return;
    }

    try {
      await registerWithEmail({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        dob: formData.dob,
        college: formData.college,
        degree: formData.degree,
        passoutYear: formData.passoutYear,
      });

      toast.success("Account created successfully!");
      navigate("/courses");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed!");
    } finally {
      setDisabled(false);
    }
  };

const handleGoogleSignIn = async () => {
  setDisabled(true);
  try {
    
    const userData = await signInWithGoogle();

    const requiredFields = ["name", "contactNumber", "dob", "college", "degree", "passoutYear"];
    const missingFields = requiredFields.filter(f => !userData[f] || userData[f].toString().trim() === "");

    if (missingFields.length > 0) {
   
      toast("Please complete your profile info first!");
      navigate("/extra-info", {
        state: { uid: userData.uid, missingFields, userData },
      });
      return;
    }

    
    toast.success("Login successful!");
    navigate("/courses");
  } catch (err) {
    console.error("Google Sign-In Error:", err);
    toast.error(err.message || "Google Sign-In failed!");
  } finally {
    setDisabled(false);
  }
};


  if (loading) return <>Loading...</>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-10">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-10 text-center text-teal-400"
      >
        Register
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleEmailRegister}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact Number", name: "contactNumber", type: "tel" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "College Name", name: "college", type: "text" },
            { label: "Degree", name: "degree", type: "text" },
            { label: "Passout Year", name: "passoutYear", type: "number" },
          ].map(({ label, name, type }) => (
            <div className="flex flex-col" key={name}>
              <label className="mb-1 text-lg">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="p-2 rounded-lg bg-transparent border-2 border-teal-500 focus:outline-none focus:border-teal-300"
                required
              />
            </div>
          ))}

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-lg">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="p-2 pr-10 rounded-lg bg-transparent border-2 border-teal-500 focus:outline-none focus:border-teal-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-9 text-teal-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <button
            type="submit"
            disabled={isDisabled}
            className={`bg-teal-500 hover:bg-teal-600 transition-colors text-white py-2 px-8 rounded-lg font-semibold text-lg ${
              isDisabled && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isDisabled ? "Registering..." : "Register with Email"}
          </button>
{/* 
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isDisabled}
            className="bg-white text-gray-900 hover:bg-gray-200 transition-colors py-2 px-8 rounded-lg font-semibold text-lg flex items-center gap-2"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
           */}
        </div>
      </motion.form>
    </div>
  );
}

export default RegisterPage;
