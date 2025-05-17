
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CreatorStudio from "@/components/CreatorStudio";
import PrinterStudio from "@/components/PrinterStudio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Studio = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (isAdmin()) {
      // Redirect admin to admin page
      navigate("/admin");
    }
  }, [user, navigate, isAdmin]);
  
  if (!user || isAdmin()) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        {user.user_metadata.role === "printer" ? (
          <PrinterStudio />
        ) : (
          <CreatorStudio />
        )}
      </motion.div>
      <Footer />
    </div>
  );
};

export default Studio;
