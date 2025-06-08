
import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  storageKey?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export const useCache = <T>(key: string, options: CacheOptions = {}) => {
  const { ttl = 5 * 60 * 1000, storageKey } = options; // Default 5 minutes TTL
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());

  // Load from localStorage if storageKey is provided
  useEffect(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          const cacheMap = new Map<string, CacheEntry<T>>();
          Object.entries(parsed).forEach(([k, v]) => {
            cacheMap.set(k, v as CacheEntry<T>);
          });
          setCache(cacheMap);
        }
      } catch (error) {
        console.warn('Failed to load cache from localStorage:', error);
      }
    }
  }, [storageKey]);

  // Save to localStorage when cache changes
  useEffect(() => {
    if (storageKey && cache.size > 0) {
      try {
        const cacheObject = Object.fromEntries(cache);
        localStorage.setItem(storageKey, JSON.stringify(cacheObject));
      } catch (error) {
        console.warn('Failed to save cache to localStorage:', error);
      }
    }
  }, [cache, storageKey]);

  const get = useCallback((cacheKey: string): T | null => {
    const entry = cache.get(cacheKey);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Entry expired, remove it
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(cacheKey);
        return newCache;
      });
      return null;
    }

    return entry.data;
  }, [cache]);

  const set = useCallback((cacheKey: string, data: T, customTtl?: number) => {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    };

    setCache(prev => {
      const newCache = new Map(prev);
      newCache.set(cacheKey, entry);
      return newCache;
    });
  }, [ttl]);

  const remove = useCallback((cacheKey: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(cacheKey);
      return newCache;
    });
  }, []);

  const clear = useCallback(() => {
    setCache(new Map());
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const has = useCallback((cacheKey: string): boolean => {
    return get(cacheKey) !== null;
  }, [get]);

  return {
    get,
    set,
    remove,
    clear,
    has
  };
};
