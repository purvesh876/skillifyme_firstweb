import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";

function RegisterPage() {
  const { currentUser, loading, registerWithEmail } = useAuthUser();
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

  const [showPassword, setShowPassword] = useState(true); // password visible by default
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) navigate("/courses");
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
      await registerWithEmail(formData);
      toast.success("Account created successfully!");
      navigate("/courses");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed!");
    } finally {
      setDisabled(false);
    }
  };

  if (loading) return <>Loading...</>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 sm:p-12"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8 text-center"
        >
          Create Your Account
        </motion.h1>

        {/* Form */}
        <motion.form
          onSubmit={handleEmailRegister}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Input fields */}
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact Number", name: "contactNumber", type: "tel" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "College Name", name: "college", type: "text" },
            { label: "Degree", name: "degree", type: "text" },
            { label: "Passout Year", name: "passoutYear", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white text-gray-800"
                required
              />
            </div>
          ))}

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="p-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white text-gray-800"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex flex-col gap-4 mt-4">
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-all ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDisabled ? "Registering..." : "Register"}
            </button>
          </div>
        </motion.form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-500 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
