/*
  # Create vehicles table for car inventory

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `make` (text) - Car manufacturer
      - `model` (text) - Car model
      - `year` (integer) - Manufacturing year
      - `price` (bigint) - Price in KSh
      - `image_url` (text) - Main display image
      - `gallery_images` (text array) - Additional images
      - `mileage` (text) - Vehicle mileage
      - `fuel_type` (text) - Petrol, Diesel, Hybrid, Electric
      - `transmission` (text) - Automatic, Manual, CVT
      - `location` (text) - Origin country
      - `features` (text array) - Vehicle features
      - `kenya_ready` (boolean) - Ready for Kenya roads
      - `rhd` (boolean) - Right hand drive
      - `body_type` (text) - SUV, Sedan, etc.
      - `engine_size` (text) - Engine capacity
      - `condition` (text) - Vehicle condition
      - `description` (text) - Detailed description
      - `status` (text) - available, sold, reserved
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `vehicles` table
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price bigint NOT NULL,
  image_url text NOT NULL,
  gallery_images text[] DEFAULT '{}',
  mileage text NOT NULL,
  fuel_type text NOT NULL DEFAULT 'Petrol',
  transmission text NOT NULL DEFAULT 'Automatic',
  location text NOT NULL DEFAULT 'Japan',
  features text[] DEFAULT '{}',
  kenya_ready boolean DEFAULT false,
  rhd boolean DEFAULT true,
  body_type text NOT NULL,
  engine_size text NOT NULL,
  condition text NOT NULL DEFAULT 'Excellent',
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can view vehicles"
  ON vehicles
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert vehicles (admin functionality)
CREATE POLICY "Authenticated users can insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update vehicles (admin functionality)
CREATE POLICY "Authenticated users can update vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete vehicles (admin functionality)
CREATE POLICY "Authenticated users can delete vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_vehicles_model ON vehicles(model);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_body_type ON vehicles(body_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles(location);
CREATE INDEX IF NOT EXISTS idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_kenya_ready ON vehicles(kenya_ready);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();