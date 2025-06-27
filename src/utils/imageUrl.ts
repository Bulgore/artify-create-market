
export const SUPABASE_PUBLIC_URL = 'https://riumhqlxdmsxwsjstqgl.supabase.co';

export const buildImageUrl = (path?: string | null): string => {
  if (!path) return '/placeholder.svg';
  
  // Si c'est déjà une URL complète, la retourner
  if (path.startsWith('http')) {
    // Vérifier si l'URL contient des caractères invalides
    if (path.includes('.js') && !path.includes('.json')) {
      console.warn('⚠️ URL invalide détectée:', path);
      return '/placeholder.svg';
    }
    return path;
  }
  
  // Si c'est un chemin qui commence par /storage/, construire l'URL complète
  if (path.startsWith('/storage/')) {
    return `${SUPABASE_PUBLIC_URL}${path}`;
  }
  
  // Vérifier si le chemin contient des caractères invalides
  if (path.includes('.js') && !path.includes('.json')) {
    console.warn('⚠️ Chemin invalide détecté:', path);
    return '/placeholder.svg';
  }
  
  // Pour les chemins bucket/filename, construire l'URL publique
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${path}`;
};

export const buildStorageUrl = (bucket: string, filePath: string): string => {
  // Vérifier si le chemin contient des caractères invalides
  if (filePath.includes('.js') && !filePath.includes('.json')) {
    console.warn('⚠️ Chemin de fichier invalide:', filePath);
    return '/placeholder.svg';
  }
  
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${bucket}/${filePath}`;
};

// Fonction spécifique pour les mockups
export const buildMockupUrl = (path?: string | null): string => {
  if (!path) return '/placeholder.svg';
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) {
    // Vérifier si l'URL contient des caractères invalides
    if (path.includes('.js') && !path.includes('.json')) {
      console.warn('⚠️ URL mockup invalide:', path);
      return '/placeholder.svg';
    }
    return path;
  }
  
  // Vérifier si le chemin contient des caractères invalides
  if (path.includes('.js') && !path.includes('.json')) {
    console.warn('⚠️ Chemin mockup invalide:', path);
    return '/placeholder.svg';
  }
  
  // Si le path contient déjà 'mockups/', l'utiliser tel quel
  if (path.includes('mockups/')) {
    return buildImageUrl(path);
  }
  
  // Sinon, ajouter le préfixe mockups/
  return buildStorageUrl('mockups', path);
};
