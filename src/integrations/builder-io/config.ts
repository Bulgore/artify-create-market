
import { Builder } from '@builder.io/react';

// Remplacez cette clé API par votre propre clé publique Builder.io
// Vous devrez vous inscrire sur builder.io pour obtenir une clé
export const BUILDER_API_KEY = 'YOUR_API_KEY';

// Initialisation de Builder.io
export const initBuilder = () => {
  Builder.init(BUILDER_API_KEY);
};

// Vous pouvez personnaliser les configurations supplémentaires ici
