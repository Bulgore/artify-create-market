
import React from "react";


const Legal = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-6 mb-4">Propriétaire du site</h2>
          <p>Podsleek SAS</p>
          <p>1234 Avenue du Pacifique</p>
          <p>98713 Papeete, Tahiti</p>
          <p>Email: contact@podsleek.com</p>
          <p>Téléphone: +689 87 12 34 56</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Directeur de la publication</h2>
          <p>John Doe, Directeur Général</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Hébergement</h2>
          <p>Ce site est hébergé par Lovable</p>
          <p>455 Market Street, Suite 500</p>
          <p>San Francisco, CA 94105</p>
          <p>États-Unis</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Propriété intellectuelle</h2>
          <p>L'ensemble des éléments constituant ce site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d'auteur et la propriété intellectuelle.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Protection des données personnelles</h2>
          <p>Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour l'exercer, veuillez nous contacter à l'adresse suivante: privacy@podsleek.com.</p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
