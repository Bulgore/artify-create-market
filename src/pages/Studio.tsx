
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CreatorStudio from "@/components/CreatorStudio";
import PrinterStudio from "@/components/PrinterStudio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Studio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        {user.user_metadata.role === "printer" ? (
          <PrinterStudio />
        ) : (
          <CreatorStudio />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Studio;
