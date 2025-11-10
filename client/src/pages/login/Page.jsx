import { useAuthUser } from "../../context/AuthUserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function Login() {
  const { currentUser, loading, loginWithEmail } = useAuthUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isDisabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || null;

  useEffect(() => {
     if (!loading && currentUser) navigate("/courses");
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setDisabled(true);

  if (!formData.email || !formData.password) {
    toast.error("All fields are required!", { duration: 2000 });
    setDisabled(false);
    return;
  }

  try {
    await loginWithEmail(formData.email, formData.password);
    toast.success("Login successful!", { duration: 2000 });

    setTimeout(() => {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/courses");
      }
    }, 800); 
  } catch (err) {
    console.error(err);
    toast.error("Invalid credentials or user not found!", { duration: 3000 });
  } finally {
    setDisabled(false);
  }
};


  if (loading) return <>Loading...</>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8 text-center"
        >
          Login
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="p-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white text-gray-800 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-all ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isDisabled ? "Logging In..." : "Login"}
          </button>
        </motion.form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-teal-500 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
