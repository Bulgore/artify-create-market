
import { useState, useEffect } from 'react';
import { NavigationItem } from '@/types/pages';

export const useNavigation = () => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des éléments de navigation
    // En réalité, cela viendrait de votre API/base de données
    const loadNavigation = async () => {
      setIsLoading(true);
      try {
        // Simulation d'éléments de navigation par défaut
        const defaultItems: NavigationItem[] = [
          {
            id: '1',
            title: 'Accueil',
            url: '/',
            order: 1,
            is_active: true
          },
          {
            id: '2',
            title: 'Produits',
            url: '/products',
            order: 2,
            is_active: true
          },
          {
            id: '3',
            title: 'Créateurs',
            url: '/creators',
            order: 3,
            is_active: true
          }
        ];
        
        setNavigationItems(defaultItems);
      } catch (error) {
        console.error('Error loading navigation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNavigation();
  }, []);

  return {
    navigationItems,
    isLoading,
    setNavigationItems
  };
};
