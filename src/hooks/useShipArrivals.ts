import { useState, useEffect } from 'react';

export interface ShipArrival {
  id: string;
  vesselName: string;
  vesselIMO: string;
  origin: string;
  destination: string;
  eta: string;
  ata?: string; // Actual Time of Arrival
  status: 'in_transit' | 'arrived' | 'berthed' | 'clearing' | 'departed';
  vehicleCount: number;
  cargoType: string;
  berthNumber?: string;
  agent: string;
  lastUpdated: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  progress: number; // 0-100 percentage
}

export interface PortStatistics {
  totalArrivals: number;
  vehiclesInPort: number;
  averageClearanceTime: number;
  portCongestion: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export const useShipArrivals = () => {
  const [arrivals, setArrivals] = useState<ShipArrival[]>([]);
  const [portStats, setPortStats] = useState<PortStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Simulate real-time data fetching from Kenya Ports Authority
  const fetchShipArrivals = async () => {
    try {
      setLoading(true);
      
      // In production, this would connect to KPA's API or marine traffic APIs
      // For now, we'll simulate realistic data with dynamic updates
      
      const mockArrivals: ShipArrival[] = [
        {
          id: 'KPA001',
          vesselName: 'MV ASIAN MAJESTY',
          vesselIMO: 'IMO9234567',
          origin: 'Yokohama, Japan',
          destination: 'Mombasa, Kenya',
          eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          vehicleCount: 145,
          cargoType: 'Used Vehicles',
          agent: 'Kenya Shipping Agency',
          lastUpdated: new Date().toISOString(),
          coordinates: { lat: -1.5, lng: 38.2 },
          progress: 75
        },
        {
          id: 'KPA002',
          vesselName: 'MV EUROPEAN STAR',
          vesselIMO: 'IMO9345678',
          origin: 'Southampton, UK',
          destination: 'Mombasa, Kenya',
          eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          vehicleCount: 89,
          cargoType: 'Used Vehicles',
          agent: 'Maritime Logistics Ltd',
          lastUpdated: new Date().toISOString(),
          coordinates: { lat: 10.2, lng: 45.8 },
          progress: 45
        },
        {
          id: 'KPA003',
          vesselName: 'MV GULF TRADER',
          vesselIMO: 'IMO9456789',
          origin: 'Dubai, UAE',
          destination: 'Mombasa, Kenya',
          eta: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          ata: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'clearing',
          vehicleCount: 67,
          cargoType: 'Used Vehicles',
          agent: 'Gulf Shipping Co.',
          lastUpdated: new Date().toISOString(),
          berthNumber: 'B-14',
          progress: 100
        },
        {
          id: 'KPA004',
          vesselName: 'MV PACIFIC VOYAGER',
          vesselIMO: 'IMO9567890',
          origin: 'Nagoya, Japan',
          destination: 'Mombasa, Kenya',
          eta: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          vehicleCount: 203,
          cargoType: 'Used Vehicles',
          agent: 'Pacific Maritime Services',
          lastUpdated: new Date().toISOString(),
          coordinates: { lat: 15.5, lng: 65.2 },
          progress: 25
        },
        {
          id: 'KPA005',
          vesselName: 'MV ATLANTIC BRIDGE',
          vesselIMO: 'IMO9678901',
          origin: 'Hamburg, Germany',
          destination: 'Mombasa, Kenya',
          eta: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          vehicleCount: 156,
          cargoType: 'Used Vehicles',
          agent: 'European Shipping Lines',
          lastUpdated: new Date().toISOString(),
          coordinates: { lat: 25.8, lng: 35.4 },
          progress: 15
        }
      ];

      const mockPortStats: PortStatistics = {
        totalArrivals: mockArrivals.length,
        vehiclesInPort: mockArrivals
          .filter(a => a.status === 'berthed' || a.status === 'clearing')
          .reduce((sum, a) => sum + a.vehicleCount, 0),
        averageClearanceTime: 4.5, // days
        portCongestion: 'medium',
        lastUpdated: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setArrivals(mockArrivals);
      setPortStats(mockPortStats);
      setLastUpdate(new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ship arrivals');
      console.error('Error fetching ship arrivals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchShipArrivals();
    
    const interval = setInterval(() => {
      fetchShipArrivals();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'berthed': return 'bg-purple-100 text-purple-800';
      case 'clearing': return 'bg-yellow-100 text-yellow-800';
      case 'departed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_transit': return '🚢';
      case 'arrived': return '⚓';
      case 'berthed': return '🏗️';
      case 'clearing': return '📋';
      case 'departed': return '✅';
      default: return '❓';
    }
  };

  const formatETA = (eta: string) => {
    const date = new Date(eta);
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      return `Arrived ${Math.abs(Math.floor(diffInHours / 24))} days ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours`;
    } else {
      return `${Math.floor(diffInHours / 24)} days`;
    }
  };

  return {
    arrivals,
    portStats,
    loading,
    error,
    lastUpdate,
    refetch: fetchShipArrivals,
    getStatusColor,
    getStatusIcon,
    formatETA
  };
};