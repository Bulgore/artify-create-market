
import { useState, useEffect } from 'react';
import { getPublishedProducts, getProductCategories, PublicCreatorProduct } from '@/services/publicProductsService';

export const usePublicProducts = (category?: string, limit = 12) => {
  const [products, setProducts] = useState<PublicCreatorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublishedProducts({ category, limit });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erreur lors du chargement des produits');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  return { products, loading, error, refetch: () => fetchProducts() };
};

export const useProductCategories = () => {
  const [categories, setCategories] = useState<string[]>(['general']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getProductCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories(['general']);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
