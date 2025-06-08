
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CreatorsGrid from '@/components/public/CreatorsGrid';

const FeaturedArtists = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Créateurs Mis en Avant
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rencontrez les artistes qui façonnent l'avenir du design
          </p>
        </div>
        
        <CreatorsGrid limit={8} />
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/artists'}
          >
            Voir tous les créateurs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtists;
