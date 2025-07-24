import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Deal = Database['public']['Tables']['deals']['Row'];

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addDeal = async (deal: Database['public']['Tables']['deals']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([deal])
        .select()
        .single();

      if (error) throw error;
      setDeals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add deal');
    }
  };

  useEffect(() => {
    fetchDeals();

    // Set up real-time subscription
    const subscription = supabase
      .channel('deals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deals' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDeals(prev => [payload.new as Deal, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDeals(prev => prev.map(d => 
              d.id === payload.new.id ? payload.new as Deal : d
            ));
          } else if (payload.eventType === 'DELETE') {
            setDeals(prev => prev.filter(d => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    deals,
    loading,
    error,
    fetchDeals,
    addDeal,
  };
};