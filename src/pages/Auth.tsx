
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = new URLSearchParams(location.search).get("tab") || "login";

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'créateur':
        return '/studio';
      case 'imprimeur':
        return '/studio';
      case 'admin':
      case 'superAdmin':
        return '/admin';
      default:
        return '/';
    }
  };

  const onLoginSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      
      // Attendre un court délai pour que le rôle soit chargé
      setTimeout(() => {
        const redirectPath = getRedirectPath(userRole || 'créateur');
        navigate(redirectPath);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Podsleek!",
        });
      }, 500);
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: { email: string; password: string; fullName: string; role: string }) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName, data.role);
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-artify-cream py-12">
      <div className="w-full max-w-md px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Bienvenue sur Podsleek</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte ou créez-en un nouveau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onSubmit={onLoginSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm onSubmit={onRegisterSubmit} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate("/")}>
              Retourner à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
