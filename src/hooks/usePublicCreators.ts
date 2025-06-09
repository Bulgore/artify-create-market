
import { useState, useEffect, useCallback } from 'react';
import { getPublicCreators, PublicCreator } from '@/services/publicProductsService';

export const usePublicCreators = (limit = 12) => {
  const [creators, setCreators] = useState<PublicCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching public creators with limit:', limit);
      
      const data = await getPublicCreators(limit);
      console.log('Fetched public creators:', data);
      
      setCreators(data);
    } catch (err) {
      console.error('Error fetching creators:', err);
      setError('Erreur lors du chargement des créateurs');
      setCreators([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  return { creators, loading, error, refetch: fetchCreators };
};
