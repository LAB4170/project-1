/*
  # Create deals table for promotional offers

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `title` (text) - Deal title
      - `description` (text) - Deal description
      - `discount_percentage` (integer) - Discount percentage
      - `valid_until` (timestamptz) - Deal expiry date
      - `image_url` (text) - Deal image
      - `is_active` (boolean) - Deal status
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `deals` table
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  discount_percentage integer NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  valid_until timestamptz NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active deals
CREATE POLICY "Anyone can view active deals"
  ON deals
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policy for authenticated users to manage deals (admin functionality)
CREATE POLICY "Authenticated users can insert deals"
  ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deals"
  ON deals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deals"
  ON deals
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_is_active ON deals(is_active);
CREATE INDEX IF NOT EXISTS idx_deals_valid_until ON deals(valid_until);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);