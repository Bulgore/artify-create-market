
import { builder } from '@builder.io/react';

// Remplacez cette clé API par votre propre clé publique Builder.io
export const BUILDER_API_KEY = 'YOUR_API_KEY';

// Initialisation de Builder.io
export const initBuilder = () => {
  builder.init(BUILDER_API_KEY);
};

// Configuration des modèles de contenu
export const registerModels = () => {
  // Enregistrer le modèle pour la page d'accueil
  builder.registerComponent(
    ({ welcomeText, subText, buttonText, buttonLink }) => {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{welcomeText}</h1>
          <p className="text-gray-600 mb-6">{subText}</p>
          <a
            href={buttonLink}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {buttonText}
          </a>
        </div>
      );
    },
    {
      name: 'Hero',
      inputs: [
        { name: 'welcomeText', type: 'string', defaultValue: 'Bienvenue sur notre site' },
        { name: 'subText', type: 'string', defaultValue: 'Découvrez nos produits et services' },
        { name: 'buttonText', type: 'string', defaultValue: 'Explorer' },
        { name: 'buttonLink', type: 'string', defaultValue: '/products' }
      ],
    }
  );

  // Vous pouvez ajouter d'autres modèles personnalisés ici
};
