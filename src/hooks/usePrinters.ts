import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Printer {
  id: string;
  name: string;
}

export const usePrinters = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrinters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('printers')
      .select('id, name')
      .order('name');
    if (!error) {
      setPrinters(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  return { printers, loading, refresh: fetchPrinters };
};
