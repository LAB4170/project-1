import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Review = Database['public']['Tables']['customer_reviews']['Row'];

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Mock data for demo
      const mockReviews: Review[] = [
        {
          id: '1',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          vehicle_id: null,
          service_type: 'import-service',
          overall_rating: 5,
          service_quality: 5,
          communication: 5,
          value_for_money: 4,
          delivery_time: 5,
          review_text: 'Excellent service! The team was professional and delivered exactly what they promised.',
          would_recommend: true,
          is_featured: true,
          status: 'approved',
          created_at: new Date().toISOString()
        }
      ];
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (review: Database['public']['Tables']['customer_reviews']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add review');
    }
  };

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setReviews(prev => prev.map(r => r.id === id ? data : r));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update review');
    }
  };

  useEffect(() => {
    fetchReviews();

    // Set up real-time subscription
    const subscription = supabase
      .channel('reviews_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'customer_reviews' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.status === 'approved') {
            setReviews(prev => [payload.new as Review, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setReviews(prev => prev.map(r => 
              r.id === payload.new.id ? payload.new as Review : r
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    addReview,
    updateReviewStatus,
  };
};