/*
  # Create real-time feedback and chat system

  1. New Tables
    - `customer_reviews`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `vehicle_id` (uuid, optional) - Related vehicle
      - `service_type` (text) - Type of service reviewed
      - `overall_rating` (integer) - 1-5 star rating
      - `service_quality` (integer) - Service quality rating
      - `communication` (integer) - Communication rating
      - `value_for_money` (integer) - Value rating
      - `delivery_time` (integer) - Delivery time rating
      - `review_text` (text) - Written review
      - `would_recommend` (boolean) - Recommendation status
      - `is_featured` (boolean) - Featured review
      - `status` (text) - pending, approved, rejected
      - `created_at` (timestamptz)

    - `chat_conversations`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone
      - `subject` (text) - Conversation subject
      - `status` (text) - active, closed, pending
      - `priority` (text) - low, medium, high, urgent
      - `assigned_admin` (text) - Admin handling chat
      - `last_message_at` (timestamptz) - Last activity
      - `created_at` (timestamptz)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid) - Related conversation
      - `sender_type` (text) - customer, admin
      - `sender_name` (text) - Message sender name
      - `message_text` (text) - Message content
      - `message_type` (text) - text, image, file
      - `is_read` (boolean) - Read status
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public customer access and admin management
*/

-- Customer Reviews Table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  service_type text NOT NULL DEFAULT 'import-service',
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  service_quality integer NOT NULL CHECK (service_quality >= 1 AND service_quality <= 5),
  communication integer NOT NULL CHECK (communication >= 1 AND communication <= 5),
  value_for_money integer NOT NULL CHECK (value_for_money >= 1 AND value_for_money <= 5),
  delivery_time integer NOT NULL CHECK (delivery_time >= 1 AND delivery_time <= 5),
  review_text text NOT NULL,
  would_recommend boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pending')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_admin text DEFAULT '',
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'admin')),
  sender_name text NOT NULL,
  message_text text NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Customer Reviews Policies
CREATE POLICY "Anyone can insert reviews"
  ON customer_reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved reviews"
  ON customer_reviews
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Authenticated users can manage all reviews"
  ON customer_reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Chat Conversations Policies
CREATE POLICY "Anyone can create conversations"
  ON chat_conversations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Customers can view their conversations"
  ON chat_conversations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage conversations"
  ON chat_conversations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Chat Messages Policies
CREATE POLICY "Anyone can insert messages"
  ON chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
  ON chat_messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_rating ON customer_reviews(overall_rating);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON customer_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_vehicle_id ON customer_reviews(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_priority ON chat_conversations(priority);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message ON chat_conversations(last_message_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_type ON chat_messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON chat_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Function to update last_message_at in conversations
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation timestamp
CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();