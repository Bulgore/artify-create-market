
import { useState, useEffect, useCallback } from 'react';
import { getPublishedProducts, PublicCreatorProduct } from '@/services/publicProductsService';
import { useCache } from './useCache';

interface ProductFilters {
  search?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
}

interface UseOptimizedProductsOptions {
  limit?: number;
  filters?: ProductFilters;
  enableCache?: boolean;
  cacheTtl?: number;
}

export const useOptimizedProducts = (options: UseOptimizedProductsOptions = {}) => {
  const { 
    limit = 20, 
    filters = {}, 
    enableCache = true, 
    cacheTtl = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [products, setProducts] = useState<PublicCreatorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const cache = useCache<PublicCreatorProduct[]>('products-cache', { 
    ttl: cacheTtl, 
    storageKey: enableCache ? 'products-cache' : undefined 
  });

  const generateCacheKey = useCallback((filters: ProductFilters, page: number, limit: number) => {
    return `products-${JSON.stringify(filters)}-${page}-${limit}`;
  }, []);

  const fetchProducts = useCallback(async (resetProducts = false) => {
    const cacheKey = generateCacheKey(filters, page, limit);
    
    // Check cache first
    if (enableCache && !resetProducts) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('Loading products from cache:', cacheKey);
        if (resetProducts) {
          setProducts(cachedData);
        } else {
          setProducts(prev => [...prev, ...cachedData]);
        }
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getPublishedProducts({
        limit,
        offset: resetProducts ? 0 : (page - 1) * limit,
        category: filters.category
      });

      console.log('Fetched products from API:', data.length);

      // Cache the results
      if (enableCache) {
        cache.set(cacheKey, data, cacheTtl);
      }

      if (resetProducts) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }

      setHasMore(data.length === limit);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit, enableCache, cache, cacheTtl, generateCacheKey]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(true);
  }, [filters.search, filters.category, filters.priceRange, filters.sortBy, limit]);

  // Fetch more products when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page, fetchProducts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    if (enableCache) {
      cache.clear();
    }
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(true);
  }, [enableCache, cache, fetchProducts]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};
