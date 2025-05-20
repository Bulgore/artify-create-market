
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import AdminTabs from "@/components/admin/AdminTabs";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (!isAdmin()) {
      navigate("/");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
    }
  }, [user, navigate, isAdmin, toast]);

  if (!user || !isAdmin()) {
    return null; // Ne rien rendre pendant la redirection
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">Gérez tous les aspects de la plateforme Podsleek</p>
        </header>
        
        <AdminTabs />
      </motion.div>
      <Footer />
    </div>
  );
};

export default Admin;
