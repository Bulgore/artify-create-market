
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Package, Users, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedArtists from "@/components/FeaturedArtists";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  const { user, isCreateur, isImprimeur, userRole, loading } = useAuth();

  const getWelcomeMessage = () => {
    if (isCreateur()) return "Bienvenue dans votre espace créateur !";
    if (isImprimeur()) return "Bienvenue dans votre espace imprimeur !";
    return "Bienvenue sur Podsleek !";
  };

  const getActionCard = () => {
    if (isCreateur()) {
      return (
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-orange-600" />
              Votre Studio Créateur
            </CardTitle>
            <CardDescription>
              Gérez vos designs, créez de nouveaux produits et suivez vos ventes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <Link to="/studio">
                Accéder à mon Studio
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (isImprimeur()) {
      return (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Votre Studio Imprimeur
            </CardTitle>
            <CardDescription>
              Gérez vos produits d'impression et collaborez avec les créateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/studio">
                Accéder à mon Studio
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Message de bienvenue personnalisé pour les utilisateurs connectés */}
      {user && !loading && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-orange-900">
                  {getWelcomeMessage()}
                </h2>
                {userRole && (
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {userRole === 'créateur' ? 'Créateur' : 
                     userRole === 'imprimeur' ? 'Imprimeur' : 
                     userRole}
                  </Badge>
                )}
              </div>
              
              {(isCreateur() || isImprimeur()) && (
                <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  <Link to="/studio" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Accéder à mon Studio
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section d'action rapide pour les utilisateurs connectés */}
      {user && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getActionCard()}
            
            {/* Statistiques rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  Communauté
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Créateurs actifs</span>
                    <span className="font-medium">250+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Produits disponibles</span>
                    <span className="font-medium">1,200+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liens rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/products">
                    <Package className="h-4 w-4 mr-2" />
                    Parcourir les produits
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/artists">
                    <Users className="h-4 w-4 mr-2" />
                    Découvrir les artistes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Contenu principal pour tous les utilisateurs */}
      <main>
        <HeroSection />
        <FeaturedProducts />
        <FeaturedArtists />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
