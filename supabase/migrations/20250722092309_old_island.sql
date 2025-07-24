/*
  # Create inquiries table for customer inquiries

  1. New Tables
    - `inquiries`
      - `id` (uuid, primary key)
      - `name` (text) - Customer name
      - `email` (text) - Customer email
      - `phone` (text) - Customer phone
      - `service` (text) - Service type
      - `budget` (text) - Customer budget
      - `message` (text) - Inquiry message
      - `vehicle_id` (uuid, optional) - Related vehicle
      - `status` (text) - new, contacted, closed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `inquiries` table
    - Add policies for authenticated admin access
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  budget text DEFAULT '',
  message text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage inquiries (admin functionality)
CREATE POLICY "Authenticated users can view inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert inquiries"
  ON inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inquiries"
  ON inquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_vehicle_id ON inquiries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);