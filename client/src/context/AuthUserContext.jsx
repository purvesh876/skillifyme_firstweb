// src/context/AuthUserContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../lib/firebase"; 
import toast from "react-hot-toast";


const auth = getAuth(app);
const db = getFirestore(app);


const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setCurrentUser(snap.data());
          } else {
           
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              name: user.displayName,
              emailVerified: user.emailVerified,
            });
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          toast.error("Failed to load user data");
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveUserToFirestore = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    const payload = {
      ...data,
      uid,
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, payload, { merge: true });
    setCurrentUser(payload);
    return payload;
  };


  const registerWithEmail = async (userInfo) => {
    const {
      name,
      email,
      password,
      contactNumber,
      dob,
      college,
      degree,
      passoutYear,
      
    } = userInfo;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await updateProfile(user, { displayName: name });

      const userData = {
        name,
        email,
        password, 
        contactNumber,
        dob,
        college,
        degree,
        passoutYear,
        coursesPurchased: {},
        createdAt: serverTimestamp(),
      };

      await saveUserToFirestore(user.uid, userData);
      toast.success("Account created successfully!");
      return userData;
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

 
  const loginWithEmail = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCurrentUser(data);
        toast.success("Login successful!");
        return data;
      } else {
        toast.error("No Firestore record found for this user");
        return null;
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  
 const signInWithGoogle = async (askExtraInfoCallback) => {
  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setCurrentUser(data);
      toast.success("Welcome back!");
      return data;
    } else {
      
      let extraData = {};
      if (askExtraInfoCallback) {
        extraData = await askExtraInfoCallback(user); 
      }

      const userData = {
        name: user.displayName || extraData.name || "",
        email: user.email,
        contactNumber: extraData.contactNumber || "",
        dob: extraData.dob || "",
        college: extraData.college || "",
        degree: extraData.degree || "",
        passoutYear: extraData.passoutYear || "",
        coursesPurchased: {},
        createdAt: serverTimestamp(),
        signInProvider: "google",
      };

      await saveUserToFirestore(user.uid, userData);
      setCurrentUser(userData);
      toast.success("Google account registered!");
      return userData;
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Google Sign-in failed");
    throw error;
  }
};


  return (
    <AuthUserContext.Provider
      value={{
        currentUser,
        loading,
        registerWithEmail,
        loginWithEmail,
        signInWithGoogle,
        saveUserToFirestore,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};


export const useAuthUser = () => useContext(AuthUserContext);
