import { useAuthUser } from "../../context/AuthUserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

function Login() {
  const { currentUser, loading, loginWithEmail,signInWithGoogle } = useAuthUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isDisabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();


  useEffect(() => {
    const redirectUser = async () => {
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        if (role === "admin") navigate("/admin");
        else navigate("/courses");
      }
    };
    redirectUser();
  }, [currentUser, navigate]);

  
  const getUserRole = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) return snap.data().role || "user";
      return "user";
    } catch (e) {
      console.error(e);
      return "user";
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setDisabled(true);

  if (!formData.email || !formData.password) {
    toast.error("All fields are required!");
    setDisabled(false);
    return;
  }

  try {
    const userCredential = await loginWithEmail(
      formData.email,
      formData.password
    );

    const uid = userCredential.uid || userCredential.user?.uid;

   
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    const userData = snap.exists() ? snap.data() : {};

    const requiredFields = [
      "name",
      "contactNumber",
      "dob",
      "college",
      "degree",
      "passoutYear",
    ];
    const missingFields = requiredFields.filter(
      (f) => !userData[f] || userData[f].trim() === ""
    );

    if (missingFields.length > 0) {
      toast("Please complete your profile first!");
      navigate("/google-extra-info", {
        state: { uid, missingFields, userData },
      });
      return;
    }

    const role = await getUserRole(uid);
    toast.success("Login successful!");
    navigate(role === "admin" ? "/admin" : "/courses");
  } catch (err) {
    console.error(err);
    toast.error("Invalid credentials or user not found!");
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
    <div className="bg-gray-900 flex min-h-screen items-center justify-center text-white">
      <Toaster />
      <div className="flex flex-col items-center w-full max-w-md px-6 py-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-bold text-5xl text-teal-400 mb-6">LOGIN</h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full flex flex-col gap-6"
        >
          {/* Email */}
          <div className="flex flex-col gap-2 text-lg">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="p-2 border-2 rounded-lg bg-gray-700 text-white focus:border-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 text-lg">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="p-2 pr-10 border-2 rounded-lg bg-gray-700 text-white focus:border-teal-500 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Email Login */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition duration-200 ${
              isDisabled ? "opacity-50" : ""
            }`}
          >
            {isDisabled ? "Logging In..." : "Login"}
          </button>

          {/* Google Login */}
          {/* 
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isDisabled}
            className="bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>*/}
        </motion.form>
      </div>
    </div>
  );
}

export default Login;
