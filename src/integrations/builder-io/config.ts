
// Import du SDK builder
import { builder } from '@builder.io/react';

// Remplacez cette clé API par votre propre clé publique Builder.io
// Vous devrez vous inscrire sur builder.io pour obtenir une clé
export const BUILDER_API_KEY = 'YOUR_API_KEY';

// Initialisation de Builder.io
export const initBuilder = () => {
  builder.init(BUILDER_API_KEY);
};

// Vous pouvez ajouter des configurations supplémentaires ici
