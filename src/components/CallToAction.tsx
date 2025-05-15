
import React from "react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <div className="bg-artify-blue text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Créez votre boutique
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Avancez artistiquement et commencez à vendre vos créations sans vous soucier de la logistique
        </p>
        <Button className="bg-white text-artify-blue hover:bg-gray-100 text-lg px-8 py-6">
          Rejoignez-nous maintenant !
        </Button>
      </div>
    </div>
  );
};

export default CallToAction;
