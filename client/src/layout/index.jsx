import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AuthLayouts = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16"> 
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayouts;
