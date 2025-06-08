
import { useState, useEffect } from 'react';
import { getPublicCreators, PublicCreator } from '@/services/publicProductsService';

export const usePublicCreators = (limit = 12) => {
  const [creators, setCreators] = useState<PublicCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicCreators(limit);
        setCreators(data);
      } catch (err) {
        console.error('Error fetching creators:', err);
        setError('Erreur lors du chargement des créateurs');
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [limit]);

  return { creators, loading, error, refetch: () => fetchCreators() };
};
