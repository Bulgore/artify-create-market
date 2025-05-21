
import { useState, useEffect } from "react";
import { NavigationItem } from "@/types/pages";

export const useNavigation = (type: "header" | "footer") => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNavigation = () => {
      try {
        setIsLoading(true);
        const savedItems = localStorage.getItem(`navigation_${type}`);
        const items = savedItems ? JSON.parse(savedItems) : [];
        setNavigationItems(items);
      } catch (error) {
        console.error(`Erreur lors du chargement de la navigation ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNavigation();
  }, [type]);

  return { navigationItems, isLoading };
};
