
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout/AdminLayout";

const Admin = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Rediriger si non connecté ou non admin
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

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="h-screen w-full bg-slate-100">
      <AdminLayout onSignOut={handleSignOut} />
    </div>
  );
};

export default Admin;
