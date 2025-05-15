
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions générales d'utilisation</h1>
        
        <div className="prose max-w-none">
          <p className="font-medium">Dernière mise à jour : 15 Mai 2025</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptation des conditions</h2>
          <p>Les présentes Conditions Générales d'Utilisation (ci-après dénommées "CGU") régissent l'utilisation du site Podsleek (ci-après dénommé "le Site") et les services qui y sont proposés.</p>
          <p>En accédant au Site et en utilisant ses fonctionnalités, vous reconnaissez avoir lu, compris et accepté les présentes CGU.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description des services</h2>
          <p>Podsleek est une plateforme de print-on-demand permettant :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Aux créateurs de proposer leurs designs sur divers produits</li>
            <li>Aux imprimeurs locaux de recevoir et traiter des commandes</li>
            <li>Aux acheteurs de personnaliser et commander des produits</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Compte utilisateur</h2>
          <p>Pour utiliser certaines fonctionnalités du Site, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos identifiants de connexion et de toutes les activités qui se produisent sous votre compte.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Propriété intellectuelle</h2>
          <p>Tous les designs téléchargés par les créateurs restent leur propriété intellectuelle. En téléchargeant un design sur Podsleek, les créateurs accordent à la plateforme une licence non-exclusive pour reproduire, adapter et commercialiser le design sur les produits proposés.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Responsabilités</h2>
          <p>Les utilisateurs s'engagent à ne pas télécharger de contenu illégal, offensant, ou violant les droits de propriété intellectuelle de tiers.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Modifications des CGU</h2>
          <p>Podsleek se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications substantielles.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">7. Droit applicable</h2>
          <p>Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation et/ou à leur exécution relève des tribunaux français.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
