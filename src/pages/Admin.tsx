
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Import admin panel components
import UsersManagement from "@/components/admin/UsersManagement";
import ProductsManagement from "@/components/admin/ProductsManagement";
import DesignsManagement from "@/components/admin/DesignsManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import SiteSettings from "@/components/admin/SiteSettings";

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
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="pages">Pages du Site</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>
          
          <TabsContent value="designs">
            <DesignsManagement />
          </TabsContent>
          
          <TabsContent value="pages">
            <PagesManagement />
          </TabsContent>
          
          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Admin;
