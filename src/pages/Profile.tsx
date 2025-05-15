
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, session } = useAuth();
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
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Vos informations de profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nom</p>
              <p>{user.user_metadata?.full_name || "Non renseigné"}</p>
            </div>
            <Button variant="outline" className="mt-4">
              Modifier le profil
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Mon activité</CardTitle>
            <CardDescription>Votre historique sur Artify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => navigate("/studio")} className="bg-artify-blue hover:bg-blue-700 text-white">
                Aller à mon Studio
              </Button>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Designs récents</h3>
                <p className="text-gray-500">
                  Vous n'avez pas encore créé de designs. Allez dans votre studio pour commencer.
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Commandes récentes</h3>
                <p className="text-gray-500">
                  Vous n'avez pas encore effectué de commandes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
