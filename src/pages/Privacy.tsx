
import React from "react";


const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
        
        <div className="prose max-w-none">
          <p className="font-medium">Dernière mise à jour : 15 Mai 2025</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Collecte des données personnelles</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Informations d'identification (nom, prénom, adresse email)</li>
            <li>Informations de contact (adresse postale, numéro de téléphone)</li>
            <li>Informations de paiement (traitées de manière sécurisée par nos prestataires de paiement)</li>
            <li>Données de navigation (cookies, adresse IP)</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Utilisation des données</h2>
          <p>Vos données personnelles sont utilisées pour :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Gérer votre compte et vos commandes</li>
            <li>Traiter et expédier vos commandes</li>
            <li>Vous informer sur nos offres et services (si vous avez consenti à recevoir nos communications)</li>
            <li>Améliorer notre plateforme et nos services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Protection des données</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre toute perte, altération ou accès non autorisé.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Partage des données</h2>
          <p>Nous partageons vos données avec :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Les imprimeurs partenaires (uniquement pour le traitement des commandes)</li>
            <li>Les prestataires de services de paiement et de livraison</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Vos droits</h2>
          <p>Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement ("droit à l'oubli")</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Cookies</h2>
          <p>Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne plus être disponibles.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">7. Contact</h2>
          <p>Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter à l'adresse suivante : privacy@podsleek.com</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
