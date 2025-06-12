
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Clock } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Wrench className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Site en maintenance
            </h1>
            <p className="text-gray-600 mb-4">
              Nous effectuons actuellement des améliorations sur notre plateforme pour vous offrir une meilleure expérience.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Retour prévu</span>
            </div>
            <p className="text-blue-700">Bientôt disponible</p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Merci pour votre patience.</p>
            <p className="mt-2">
              Pour toute urgence, contactez-nous à{" "}
              <a href="mailto:contact@podsleek.com" className="text-blue-600 hover:underline">
                contact@podsleek.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
