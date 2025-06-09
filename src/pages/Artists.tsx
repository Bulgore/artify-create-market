
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreatorsGrid from '@/components/public/CreatorsGrid';

const Artists = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Créateurs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Rencontrez les artistes et designers qui donnent vie à leurs créations sur notre plateforme.
          </p>
        </div>

        <CreatorsGrid />
      </div>
      <Footer />
    </div>
  );
};

export default Artists;
