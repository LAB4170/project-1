import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface SearchFilters {
  make?: string;
  bodyType?: string;
  priceRange?: string;
  location?: string;
  fuelType?: string;
  transmission?: string;
  kenyaReady?: boolean;
  rhd?: boolean;
  searchQuery?: string;
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async (filters: SearchFilters = {}) => {
    try {
      setLoading(true);
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }
      if (filters.bodyType && filters.bodyType !== 'all') {
        query = query.eq('body_type', filters.bodyType);
      }
      if (filters.location && filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }
      if (filters.fuelType && filters.fuelType !== 'all') {
        query = query.eq('fuel_type', filters.fuelType);
      }
      if (filters.transmission && filters.transmission !== 'all') {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters.kenyaReady !== undefined) {
        query = query.eq('kenya_ready', filters.kenyaReady);
      }
      if (filters.rhd !== undefined) {
        query = query.eq('rhd', filters.rhd);
      }
      if (filters.searchQuery) {
        query = query.or(`make.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%`);
      }

      // Apply price range filter
      if (filters.priceRange && filters.priceRange !== 'all') {
        switch (filters.priceRange) {
          case 'under2m':
            query = query.lt('price', 2000000);
            break;
          case '2m-4m':
            query = query.gte('price', 2000000).lte('price', 4000000);
            break;
          case 'above4m':
            query = query.gt('price', 4000000);
            break;
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setVehicles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicle: Database['public']['Tables']['vehicles']['Insert']) => {
    try {
      // Ensure the vehicle has all required fields
      const vehicleData = {
        ...vehicle,
        status: vehicle.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state immediately for better UX
      setVehicles(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add vehicle');
    }
  };

  const updateVehicle = async (id: string, updates: Database['public']['Tables']['vehicles']['Update']) => {
    try {
      // Ensure updated_at is set
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state immediately
      setVehicles(prev => prev.map(v => v.id === id ? data : v));
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update vehicle');
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state immediately
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete vehicle');
    }
  };

  useEffect(() => {
    fetchVehicles();

    // Set up real-time subscription
    const subscription = supabase
      .channel('vehicles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vehicles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVehicles(prev => [payload.new as Vehicle, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setVehicles(prev => prev.map(v => 
              v.id === payload.new.id ? payload.new as Vehicle : v
            ));
          } else if (payload.eventType === 'DELETE') {
            setVehicles(prev => prev.filter(v => v.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};