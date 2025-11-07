import express from "express";
import { adminAuth, adminFirestore } from "../lib/firebaseAdmin.js"; // your firebase admin config
import { Timestamp } from "firebase-admin/firestore";

const router = express.Router();

// 🔐 POST /api/register
router.post("/register", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Verify token using Firebase Admin
    const idToken = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // ✅ Extract user data from request body
    const {
      name,
      email,
      contact,
      dob,
      college,
      degree,
      passoutYear,
    } = req.body;

    // ✅ Reference user document in Firestore
    const userRef = adminFirestore.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      // 🔄 Update existing user record
      await userRef.update({
        name,
        email,
        contact,
        dob,
        college,
        degree,
        passoutYear,
        updatedAt: Timestamp.now(),
      });
    } else {
      // 🆕 Create new user record
      await userRef.set({
        name,
        email,
        contact,
        dob,
        college,
        degree,
        passoutYear,
        role: "user", // default role
        createdAt: Timestamp.now(),
      });
    }

    // ✅ Respond with success and role
    res.json({
      success: true,
      role: "user",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in /api/register:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

export default router;
