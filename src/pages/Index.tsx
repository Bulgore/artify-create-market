
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import FeaturedCreators from '@/components/FeaturedCreators';
import CallToAction from '@/components/CallToAction';

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <>
      <main>
        <HeroSection />
        <FeaturedProducts />
        <FeaturedCreators />
        
        {!user && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t('home.joinCommunity', 'Rejoignez notre communauté')}
              </h2>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/auth?tab=register"
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  {t('button.register', "S'inscrire")}
                </Link>
                <Link
                  to="/auth?tab=login"
                  className="bg-white text-orange-600 border border-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  {t('button.login', 'Se connecter')}
                </Link>
              </div>
            </div>
          </section>
        )}
        
        <CallToAction />
      </main>
    </>
  );
};

export default Index;
