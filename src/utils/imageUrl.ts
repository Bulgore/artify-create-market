
export const SUPABASE_PUBLIC_URL = 'https://riumhqlxdmsxwsjstqgl.supabase.co';

// Fonction pour nettoyer et valider les chemins de fichiers
const sanitizeFilePath = (path: string): string => {
  // Supprimer les caractères invalides et normaliser le chemin
  return path
    .replace(/[<>:"|?*]/g, '') // Supprimer caractères interdits
    .replace(/\\/g, '/') // Normaliser les slashes
    .replace(/\/+/g, '/') // Supprimer les slashes multiples
    .replace(/^\//, ''); // Supprimer le slash initial si présent
};

// Fonction pour vérifier si une URL est accessible
export const checkImageAccess = async (url: string): Promise<boolean> => {
  try {
    console.log('🔍 [checkImageAccess] Test d\'accessibilité:', url);
    const response = await fetch(url, { method: 'HEAD' });
    const isAccessible = response.ok;
    console.log(`${isAccessible ? '✅' : '❌'} [checkImageAccess] Statut ${response.status}:`, url);
    return isAccessible;
  } catch (error) {
    console.error('❌ [checkImageAccess] Erreur réseau:', error, url);
    return false;
  }
};

export const buildImageUrl = (path?: string | null): string => {
  if (!path) {
    console.log('⚠️ [buildImageUrl] Chemin vide, utilisation placeholder');
    return '/placeholder.svg';
  }
  
  console.log('🔧 [buildImageUrl] Traitement du chemin:', path);
  
  // Si c'est déjà une URL complète, la retourner après validation
  if (path.startsWith('http')) {
    // Vérifier si l'URL contient des caractères invalides
    if (path.includes('.js') && !path.includes('.json')) {
      console.warn('⚠️ [buildImageUrl] URL invalide détectée:', path);
      return '/placeholder.svg';
    }
    console.log('✅ [buildImageUrl] URL complète retournée:', path);
    return path;
  }
  
  // Nettoyer le chemin
  const cleanPath = sanitizeFilePath(path);
  
  // Si c'est un chemin qui commence par /storage/, construire l'URL complète
  if (cleanPath.startsWith('storage/')) {
    const fullUrl = `${SUPABASE_PUBLIC_URL}/${cleanPath}`;
    console.log('🔗 [buildImageUrl] URL storage construite:', fullUrl);
    return fullUrl;
  }
  
  // Vérifier si le chemin contient des caractères invalides
  if (cleanPath.includes('.js') && !cleanPath.includes('.json')) {
    console.warn('⚠️ [buildImageUrl] Chemin invalide détecté:', cleanPath);
    return '/placeholder.svg';
  }
  
  // Pour les chemins bucket/filename, construire l'URL publique
  const publicUrl = `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${cleanPath}`;
  console.log('🌐 [buildImageUrl] URL publique construite:', publicUrl);
  return publicUrl;
};

export const buildStorageUrl = (bucket: string, filePath: string): string => {
  const cleanPath = sanitizeFilePath(filePath);
  
  // Vérifier si le chemin contient des caractères invalides
  if (cleanPath.includes('.js') && !cleanPath.includes('.json')) {
    console.warn('⚠️ [buildStorageUrl] Chemin de fichier invalide:', cleanPath);
    return '/placeholder.svg';
  }
  
  const url = `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
  console.log('📦 [buildStorageUrl] URL bucket construite:', { bucket, filePath: cleanPath, url });
  return url;
};

// Fonction spécifique pour les designs - TOUJOURS utiliser les URLs publiques
export const buildDesignUrl = (path?: string | null): string => {
  if (!path) {
    console.log('⚠️ [buildDesignUrl] Chemin design vide');
    return '/placeholder.svg';
  }
  
  console.log('🎨 [buildDesignUrl] Traitement design:', path);
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) {
    // Si c'est une URL signée, la convertir en URL publique
    if (path.includes('/sign/designs/')) {
      // Extraire le chemin du fichier depuis l'URL signée
      const match = path.match(/\/sign\/designs\/(.+?)(?:\?|$)/);
      if (match) {
        const filePath = match[1];
        const publicUrl = buildStorageUrl('designs', filePath);
        console.log('🔄 [buildDesignUrl] Conversion URL signée vers publique:', path, '->', publicUrl);
        return publicUrl;
      }
    }
    
    // Vérifier si l'URL contient des caractères invalides
    if (path.includes('.js') && !path.includes('.json')) {
      console.warn('⚠️ [buildDesignUrl] URL design invalide:', path);
      return '/placeholder.svg';
    }
    
    console.log('✅ [buildDesignUrl] URL design complète:', path);
    return path;
  }
  
  const cleanPath = sanitizeFilePath(path);
  
  // Vérifier si le chemin contient des caractères invalides
  if (cleanPath.includes('.js') && !cleanPath.includes('.json')) {
    console.warn('⚠️ [buildDesignUrl] Chemin design invalide:', cleanPath);
    return '/placeholder.svg';
  }
  
  // Si le path contient déjà 'designs/', l'utiliser tel quel
  if (cleanPath.includes('designs/')) {
    const publicUrl = buildImageUrl(cleanPath);
    console.log('📁 [buildDesignUrl] Chemin avec designs/ existant:', publicUrl);
    return publicUrl;
  }
  
  // Sinon, ajouter le préfixe designs/
  const designUrl = buildStorageUrl('designs', cleanPath);
  console.log('🎯 [buildDesignUrl] URL design finale:', designUrl);
  return designUrl;
};

// Fonction spécifique pour les mockups
export const buildMockupUrl = (path?: string | null): string => {
  if (!path) {
    console.log('⚠️ [buildMockupUrl] Chemin mockup vide');
    return '/placeholder.svg';
  }
  
  console.log('🖼️ [buildMockupUrl] Traitement mockup:', path);
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) {
    // Vérifier si l'URL contient des caractères invalides
    if (path.includes('.js') && !path.includes('.json')) {
      console.warn('⚠️ [buildMockupUrl] URL mockup invalide:', path);
      return '/placeholder.svg';
    }
    console.log('✅ [buildMockupUrl] URL mockup complète:', path);
    return path;
  }
  
  const cleanPath = sanitizeFilePath(path);
  
  // Vérifier si le chemin contient des caractères invalides
  if (cleanPath.includes('.js') && !cleanPath.includes('.json')) {
    console.warn('⚠️ [buildMockupUrl] Chemin mockup invalide:', cleanPath);
    return '/placeholder.svg';
  }
  
  // Si le path contient déjà 'mockups/', l'utiliser tel quel
  if (cleanPath.includes('mockups/')) {
    const publicUrl = buildImageUrl(cleanPath);
    console.log('📁 [buildMockupUrl] Chemin avec mockups/ existant:', publicUrl);
    return publicUrl;
  }
  
  // Sinon, ajouter le préfixe mockups/
  const mockupUrl = buildStorageUrl('mockups', cleanPath);
  console.log('🎭 [buildMockupUrl] URL mockup finale:', mockupUrl);
  return mockupUrl;
};

// Fonction pour diagnostiquer les problèmes d'URL
export const diagnoseImageUrl = async (url: string): Promise<{
  isAccessible: boolean;
  status?: number;
  error?: string;
  suggestions: string[];
}> => {
  const suggestions: string[] = [];
  
  try {
    console.log('🔬 [diagnoseImageUrl] Diagnostic de:', url);
    
    if (!url || url === '/placeholder.svg') {
      return {
        isAccessible: false,
        error: 'URL vide ou placeholder',
        suggestions: ['Vérifier que le fichier a été correctement uploadé', 'Vérifier les données en base']
      };
    }
    
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      console.log('✅ [diagnoseImageUrl] URL accessible');
      return { isAccessible: true, status: response.status, suggestions: [] };
    }
    
    // Analyser les erreurs courantes
    if (response.status === 404) {
      suggestions.push('Le fichier n\'existe pas dans le storage Supabase');
      suggestions.push('Vérifier le nom et le chemin du fichier');
      suggestions.push('Re-uploader le fichier si nécessaire');
    } else if (response.status === 403) {
      suggestions.push('Problème de permissions sur le bucket');
      suggestions.push('Vérifier que le bucket est public');
    } else if (response.status >= 500) {
      suggestions.push('Erreur serveur Supabase');
      suggestions.push('Réessayer plus tard');
    }
    
    console.log(`❌ [diagnoseImageUrl] Erreur ${response.status}:`, url);
    return {
      isAccessible: false,
      status: response.status,
      error: `HTTP ${response.status}`,
      suggestions
    };
    
  } catch (error) {
    console.error('💥 [diagnoseImageUrl] Erreur réseau:', error);
    suggestions.push('Erreur de réseau ou CORS');
    suggestions.push('Vérifier la connexion internet');
    
    return {
      isAccessible: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      suggestions
    };
  }
};
