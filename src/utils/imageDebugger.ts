
import { supabase } from '@/integrations/supabase/client';
import { buildDesignUrl, diagnoseImageUrl } from './imageUrl';

interface ImageDebugInfo {
  url: string;
  dbRecord?: any;
  storageExists: boolean;
  httpAccessible: boolean;
  diagnostic: any;
  suggestions: string[];
}

// Fonction pour débugger une URL d'image spécifique
export const debugImageUrl = async (url: string): Promise<ImageDebugInfo> => {
  console.log('🔬 [debugImageUrl] Début du diagnostic pour:', url);
  
  const result: ImageDebugInfo = {
    url,
    storageExists: false,
    httpAccessible: false,
    diagnostic: null,
    suggestions: []
  };

  try {
    // 1. Vérifier si l'URL existe en base de données
    const { data: dbRecords } = await supabase
      .from('media_files')
      .select('*')
      .eq('file_url', url)
      .limit(1);
    
    if (dbRecords && dbRecords.length > 0) {
      result.dbRecord = dbRecords[0];
      console.log('✅ [debugImageUrl] Enregistrement trouvé en base:', result.dbRecord);
    } else {
      console.log('⚠️ [debugImageUrl] Aucun enregistrement en base pour cette URL');
      result.suggestions.push('URL non trouvée en base de données');
    }

    // 2. Extraire le chemin du fichier depuis l'URL
    let filePath = '';
    if (url.includes('/public/designs/')) {
      filePath = url.split('/public/designs/')[1];
    } else if (url.includes('/sign/designs/')) {
      const match = url.match(/\/sign\/designs\/(.+?)(?:\?|$)/);
      filePath = match ? match[1] : '';
    }

    // 3. Vérifier l'existence dans le storage Supabase
    if (filePath) {
      const pathParts = filePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folderPath = pathParts.slice(0, -1).join('/');
      
      console.log('📁 [debugImageUrl] Vérification storage:', { folderPath, fileName });
      
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('designs')
        .list(folderPath, {
          search: fileName
        });

      if (storageError) {
        console.error('❌ [debugImageUrl] Erreur storage:', storageError);
        result.suggestions.push(`Erreur storage: ${storageError.message}`);
      } else if (storageFiles && storageFiles.length > 0) {
        result.storageExists = true;
        console.log('✅ [debugImageUrl] Fichier trouvé dans le storage');
      } else {
        console.log('❌ [debugImageUrl] Fichier absent du storage');
        result.suggestions.push('Fichier absent du bucket designs');
      }
    } else {
      result.suggestions.push('Impossible d\'extraire le chemin depuis l\'URL');
    }

    // 4. Test d'accessibilité HTTP
    const diagnostic = await diagnoseImageUrl(url);
    result.diagnostic = diagnostic;
    result.httpAccessible = diagnostic.isAccessible;
    
    if (!diagnostic.isAccessible) {
      result.suggestions.push(...diagnostic.suggestions);
    }

    // 5. Suggestions supplémentaires
    if (!result.storageExists && !result.httpAccessible) {
      result.suggestions.push('Re-uploader le fichier');
      result.suggestions.push('Vérifier la configuration du bucket');
    }

    if (result.dbRecord && !result.storageExists) {
      result.suggestions.push('Nettoyer l\'enregistrement en base ou re-uploader le fichier');
    }

  } catch (error) {
    console.error('💥 [debugImageUrl] Erreur générale:', error);
    result.suggestions.push(`Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`);
  }

  console.log('📊 [debugImageUrl] Résultat final:', result);
  return result;
};

// Fonction pour débugger toutes les images d'un utilisateur
export const debugUserImages = async (userId: string): Promise<ImageDebugInfo[]> => {
  console.log('🔍 [debugUserImages] Diagnostic pour l\'utilisateur:', userId);
  
  try {
    // Récupérer tous les fichiers de l'utilisateur
    const { data: userFiles, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ [debugUserImages] Erreur récupération fichiers:', error);
      return [];
    }

    if (!userFiles || userFiles.length === 0) {
      console.log('⚠️ [debugUserImages] Aucun fichier trouvé pour cet utilisateur');
      return [];
    }

    console.log(`📊 [debugUserImages] ${userFiles.length} fichiers à diagnostiquer`);

    // Diagnostiquer chaque fichier
    const results = await Promise.all(
      userFiles.map(file => debugImageUrl(file.file_url))
    );

    // Résumé
    const accessible = results.filter(r => r.httpAccessible).length;
    const total = results.length;
    
    console.log(`📈 [debugUserImages] Résumé: ${accessible}/${total} images accessibles`);
    
    return results;

  } catch (error) {
    console.error('💥 [debugUserImages] Erreur générale:', error);
    return [];
  }
};

// Fonction pour nettoyer les enregistrements orphelins
export const cleanupOrphanedRecords = async (userId: string): Promise<number> => {
  console.log('🧹 [cleanupOrphanedRecords] Nettoyage pour:', userId);
  
  try {
    const debugResults = await debugUserImages(userId);
    const orphanedRecords = debugResults.filter(r => 
      r.dbRecord && !r.storageExists && !r.httpAccessible
    );

    if (orphanedRecords.length === 0) {
      console.log('✅ [cleanupOrphanedRecords] Aucun enregistrement orphelin');
      return 0;
    }

    console.log(`🗑️ [cleanupOrphanedRecords] ${orphanedRecords.length} enregistrements à nettoyer`);

    // Supprimer les enregistrements orphelins
    const idsToDelete = orphanedRecords
      .map(r => r.dbRecord?.id)
      .filter(id => id);

    if (idsToDelete.length > 0) {
      const { error } = await supabase
        .from('media_files')
        .delete()
        .in('id', idsToDelete);

      if (error) {
        console.error('❌ [cleanupOrphanedRecords] Erreur suppression:', error);
        return 0;
      }

      console.log(`✅ [cleanupOrphanedRecords] ${idsToDelete.length} enregistrements supprimés`);
      return idsToDelete.length;
    }

    return 0;

  } catch (error) {
    console.error('💥 [cleanupOrphanedRecords] Erreur générale:', error);
    return 0;
  }
};

// Fonction pour afficher un rapport de diagnostic dans la console
export const logImageDiagnosticReport = (results: ImageDebugInfo[]) => {
  console.group('📋 RAPPORT DE DIAGNOSTIC DES IMAGES');
  
  results.forEach((result, index) => {
    console.group(`🖼️ Image ${index + 1}: ${result.url.substring(0, 50)}...`);
    console.log('🔗 URL complète:', result.url);
    console.log('💾 En base:', result.dbRecord ? '✅ Oui' : '❌ Non');
    console.log('📦 Storage:', result.storageExists ? '✅ Existe' : '❌ Absent');
    console.log('🌐 HTTP:', result.httpAccessible ? '✅ Accessible' : '❌ Inaccessible');
    
    if (result.diagnostic && !result.httpAccessible) {
      console.log('🚫 Erreur:', result.diagnostic.error || 'Inconnue');
      console.log('📊 Statut:', result.diagnostic.status || 'N/A');
    }
    
    if (result.suggestions.length > 0) {
      console.log('💡 Suggestions:');
      result.suggestions.forEach((suggestion, i) => {
        console.log(`   ${i + 1}. ${suggestion}`);
      });
    }
    
    console.groupEnd();
  });
  
  const stats = {
    total: results.length,
    accessible: results.filter(r => r.httpAccessible).length,
    inDb: results.filter(r => r.dbRecord).length,
    inStorage: results.filter(r => r.storageExists).length
  };
  
  console.log('📊 STATISTIQUES:');
  console.log(`   Total: ${stats.total}`);
  console.log(`   Accessibles: ${stats.accessible}/${stats.total} (${Math.round(stats.accessible/stats.total*100)}%)`);
  console.log(`   En base: ${stats.inDb}/${stats.total}`);
  console.log(`   Dans storage: ${stats.inStorage}/${stats.total}`);
  
  console.groupEnd();
};
