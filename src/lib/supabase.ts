import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
  console.warn('Supabase environment variables not configured. Using mock client.');
  // Create a mock client that doesn't make actual requests
  const createQueryBuilder = () => ({
    data: [],
    error: null,
    eq: function() { return this; },
    gte: function() { return this; },
    lte: function() { return this; },
    lt: function() { return this; },
    gt: function() { return this; },
    ilike: function() { return this; },
    or: function() { return this; },
    order: function() { return this; },
    limit: function() { return this; },
    single: function() { return this; }
  });

  supabase = {
    from: () => ({
      select: () => createQueryBuilder(),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } })
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          make: string;
          model: string;
          year: number;
          price: number;
          image_url: string;
          gallery_images: string[];
          mileage: string;
          fuel_type: string;
          transmission: string;
          location: string;
          features: string[];
          kenya_ready: boolean;
          rhd: boolean;
          body_type: string;
          engine_size: string;
          condition: string;
          description: string;
          status: 'available' | 'sold' | 'reserved';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          make: string;
          model: string;
          year: number;
          price: number;
          image_url: string;
          gallery_images?: string[];
          mileage: string;
          fuel_type: string;
          transmission: string;
          location: string;
          features?: string[];
          kenya_ready?: boolean;
          rhd?: boolean;
          body_type: string;
          engine_size: string;
          condition: string;
          description: string;
          status?: 'available' | 'sold' | 'reserved';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          make?: string;
          model?: string;
          year?: number;
          price?: number;
          image_url?: string;
          gallery_images?: string[];
          mileage?: string;
          fuel_type?: string;
          transmission?: string;
          location?: string;
          features?: string[];
          kenya_ready?: boolean;
          rhd?: boolean;
          body_type?: string;
          engine_size?: string;
          condition?: string;
          description?: string;
          status?: 'available' | 'sold' | 'reserved';
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          service: string;
          budget: string;
          message: string;
          vehicle_id?: string;
          status: 'new' | 'contacted' | 'closed';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          service: string;
          budget: string;
          message: string;
          vehicle_id?: string;
          status?: 'new' | 'contacted' | 'closed';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          service?: string;
          budget?: string;
          message?: string;
          vehicle_id?: string;
          status?: 'new' | 'contacted' | 'closed';
        };
      };
      customer_reviews: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          vehicle_id?: string;
          service_type: string;
          overall_rating: number;
          service_quality: number;
          communication: number;
          value_for_money: number;
          delivery_time: number;
          review_text: string;
          would_recommend: boolean;
          is_featured: boolean;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          vehicle_id?: string;
          service_type: string;
          overall_rating: number;
          service_quality: number;
          communication: number;
          value_for_money: number;
          delivery_time: number;
          review_text: string;
          would_recommend?: boolean;
          is_featured?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          vehicle_id?: string;
          service_type?: string;
          overall_rating?: number;
          service_quality?: number;
          communication?: number;
          value_for_money?: number;
          delivery_time?: number;
          review_text?: string;
          would_recommend?: boolean;
          is_featured?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
      chat_conversations: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          subject: string;
          status: 'active' | 'closed' | 'pending';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_admin: string;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string;
          subject: string;
          status?: 'active' | 'closed' | 'pending';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_admin?: string;
          last_message_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          subject?: string;
          status?: 'active' | 'closed' | 'pending';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_admin?: string;
          last_message_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_type: 'customer' | 'admin';
          sender_name: string;
          message_text: string;
          message_type: 'text' | 'image' | 'file';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_type: 'customer' | 'admin';
          sender_name: string;
          message_text: string;
          message_type?: 'text' | 'image' | 'file';
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_type?: 'customer' | 'admin';
          sender_name?: string;
          message_text?: string;
          message_type?: 'text' | 'image' | 'file';
          is_read?: boolean;
        };
      };
      deals: {
        Row: {
          id: string;
          title: string;
          description: string;
          discount_percentage: number;
          valid_until: string;
          image_url: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          discount_percentage: number;
          valid_until: string;
          image_url: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          discount_percentage?: number;
          valid_until?: string;
          image_url?: string;
          is_active?: boolean;
        };
      };
    };
  };
};