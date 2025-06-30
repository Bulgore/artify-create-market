
export const SUPABASE_PUBLIC_URL = 'https://riumhqlxdmsxwsjstqgl.supabase.co';

// Fonction pour vérifier si une URL est accessible (version simplifiée)
export const checkImageAccess = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('❌ [checkImageAccess] Erreur réseau:', error);
    return false;
  }
};

// Fonction principale pour construire les URLs d'images
export const buildImageUrl = (path?: string | null): string => {
  if (!path) {
    return '/placeholder.svg';
  }
  
  // Si c'est déjà une URL complète, la retourner
  if (path.startsWith('http')) {
    return path;
  }
  
  // Nettoyer le chemin
  const cleanPath = path.replace(/^\//, '').replace(/\/+/g, '/');
  
  // Construire l'URL publique
  const publicUrl = `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${cleanPath}`;
  return publicUrl;
};

// Fonction spécifique pour les designs
export const buildDesignUrl = (path?: string | null): string => {
  if (!path) {
    return '/placeholder.svg';
  }
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) {
    return path;
  }
  
  const cleanPath = path.replace(/^\//, '');
  
  // Si le path contient déjà 'designs/', l'utiliser tel quel
  if (cleanPath.includes('designs/')) {
    return buildImageUrl(cleanPath);
  }
  
  // Sinon, ajouter le préfixe designs/
  return buildImageUrl(`designs/${cleanPath}`);
};

// Fonction spécifique pour les mockups
export const buildMockupUrl = (path?: string | null): string => {
  if (!path) {
    return '/placeholder.svg';
  }
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) {
    return path;
  }
  
  const cleanPath = path.replace(/^\//, '');
  
  // Si le path contient déjà 'mockups/', l'utiliser tel quel
  if (cleanPath.includes('mockups/')) {
    return buildImageUrl(cleanPath);
  }
  
  // Sinon, ajouter le préfixe mockups/
  return buildImageUrl(`mockups/${cleanPath}`);
};

export const buildStorageUrl = (bucket: string, filePath: string): string => {
  const cleanPath = filePath.replace(/^\//, '');
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
};

// Fonction de diagnostic simplifiée
export const diagnoseImageUrl = async (url: string): Promise<{
  isAccessible: boolean;
  status?: number;
  error?: string;
  suggestions: string[];
}> => {
  const suggestions: string[] = [];
  
  try {
    if (!url || url === '/placeholder.svg') {
      return {
        isAccessible: false,
        error: 'URL vide ou placeholder',
        suggestions: ['Vérifier que le fichier a été correctement uploadé']
      };
    }
    
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      return { isAccessible: true, status: response.status, suggestions: [] };
    }
    
    if (response.status === 404) {
      suggestions.push('Le fichier n\'existe pas dans le storage');
    } else if (response.status === 403) {
      suggestions.push('Problème de permissions sur le bucket');
    }
    
    return {
      isAccessible: false,
      status: response.status,
      error: `HTTP ${response.status}`,
      suggestions
    };
    
  } catch (error) {
    return {
      isAccessible: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      suggestions: ['Erreur de réseau ou CORS']
    };
  }
};
