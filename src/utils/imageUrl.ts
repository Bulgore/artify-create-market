
export const SUPABASE_PUBLIC_URL = 'https://riumhqlxdmsxwsjstqgl.supabase.co';

export const buildImageUrl = (path?: string | null): string => {
  if (!path) return '/placeholder.svg';
  
  // Si c'est déjà une URL complète, la retourner
  if (path.startsWith('http')) return path;
  
  // Si c'est un chemin qui commence par /storage/, construire l'URL complète
  if (path.startsWith('/storage/')) {
    return `${SUPABASE_PUBLIC_URL}${path}`;
  }
  
  // Pour les chemins bucket/filename, construire l'URL publique
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${path}`;
};

export const buildStorageUrl = (bucket: string, filePath: string): string => {
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${bucket}/${filePath}`;
};

// Fonction spécifique pour les mockups
export const buildMockupUrl = (path?: string | null): string => {
  if (!path) return '/placeholder.svg';
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) return path;
  
  // Si le path contient déjà 'mockups/', l'utiliser tel quel
  if (path.includes('mockups/')) {
    return buildImageUrl(path);
  }
  
  // Sinon, ajouter le préfixe mockups/
  return buildStorageUrl('mockups', path);
};
