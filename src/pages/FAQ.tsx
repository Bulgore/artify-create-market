import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQData {
  id: string;
  title_fr?: string;
  title_en?: string;
  title_ty?: string;
  content_fr?: string;
  content_en?: string;
  content_ty?: string;
}

const FAQ = () => {
  const { currentLanguage } = useLanguage();
  const [faqData, setFaqData] = useState<FAQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQData();
  }, []);

  const fetchFAQData = async () => {
    console.log('🔍 [FAQ] Chargement de la page FAQ...');
    setLoading(true);
    setError(null);

    try {
      // Recherche par slug 'faq' ou titre contenant 'FAQ'
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .or('slug.eq.faq,title_fr.ilike.%FAQ%,title_en.ilike.%FAQ%')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('📊 [FAQ] Résultat requête:', {
        data: data ? 'Données trouvées' : 'Pas de données',
        error: error,
        slug: data?.slug,
        title_fr: data?.title_fr
      });

      if (error && error.code !== 'PGRST116') { // PGRST116 = pas de résultat
        console.error('❌ [FAQ] Erreur Supabase:', error);
        throw error;
      }

      if (!data) {
        console.log('⚠️ [FAQ] Aucune page FAQ trouvée, création d\'une page par défaut');
        // Page FAQ par défaut si pas trouvée
        setFaqData({
          id: 'default',
          title_fr: 'Questions Fréquentes',
          title_en: 'Frequently Asked Questions',
          title_ty: 'Mau Uira\'a',
          content_fr: `
            <h2>Comment créer un produit ?</h2>
            <p>Pour créer un produit, rendez-vous dans votre studio créateur et suivez les étapes guidées.</p>
            
            <h2>Comment modifier un produit existant ?</h2>
            <p>Accédez à votre liste de produits et cliquez sur "Modifier" à côté du produit souhaité.</p>
            
            <h2>Pourquoi mon design n'apparaît-il pas sur le mockup ?</h2>
            <p>Vérifiez que votre design est au format PNG, JPEG ou SVG et que l'upload s'est bien déroulé.</p>
          `,
          content_en: `
            <h2>How to create a product?</h2>
            <p>To create a product, go to your creator studio and follow the guided steps.</p>
            
            <h2>How to edit an existing product?</h2>
            <p>Access your product list and click "Edit" next to the desired product.</p>
            
            <h2>Why doesn't my design appear on the mockup?</h2>
            <p>Check that your design is in PNG, JPEG or SVG format and that the upload went well.</p>
          `,
          content_ty: `
            <h2>Eaha te huru e haaapi ai i te tahua?</h2>
            <p>No te haaapi i te tahua, haere i to studio haaapi ma te faatere i na ravea.</p>
          `
        });
      } else {
        setFaqData(data);
      }

      console.log('✅ [FAQ] Page FAQ chargée avec succès');

    } catch (error: any) {
      console.error('💥 [FAQ] Erreur lors du chargement:', error);
      setError(error.message || 'Erreur lors du chargement de la FAQ');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (!faqData) return 'FAQ';
    switch (currentLanguage) {
      case 'en': return faqData.title_en || faqData.title_fr || 'FAQ';
      case 'ty': return faqData.title_ty || faqData.title_fr || 'FAQ';
      default: return faqData.title_fr || 'FAQ';
    }
  };

  const getContent = () => {
    if (!faqData) return '';
    switch (currentLanguage) {
      case 'en': return faqData.content_en || faqData.content_fr || '';
      case 'ty': return faqData.content_ty || faqData.content_fr || '';
      default: return faqData.content_fr || '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Chargement de la FAQ...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchFAQData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {getTitle()}
          </h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: getContent() }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
