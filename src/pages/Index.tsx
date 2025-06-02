
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import ContentRenderer from "@/components/content/ContentRenderer";
import FeaturedArtists from "@/components/FeaturedArtists";
import CallToAction from "@/components/CallToAction";
import { ContentBlock } from "@/types/content";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    // Charger les blocs depuis localStorage ou API
    const savedBlocks = localStorage.getItem('homepage_blocks');
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    } else {
      // Blocs par défaut
      const defaultBlocks: ContentBlock[] = [
        {
          id: '1',
          type: 'hero',
          title: 'Hero Section',
          content: {
            title: 'Bienvenue sur Podsleek',
            subtitle: 'Créez et vendez vos designs uniques',
            description: 'Connectez-vous avec des imprimeurs locaux et donnez vie à vos créations',
            buttonText: 'Commencer',
            buttonLink: '/products',
            backgroundColor: '#f8f9fa'
          },
          order: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setBlocks(defaultBlocks);
      localStorage.setItem('homepage_blocks', JSON.stringify(defaultBlocks));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <ContentRenderer blocks={blocks} />
        <FeaturedArtists />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
