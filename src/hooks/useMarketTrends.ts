import { useState, useEffect } from 'react';

export interface MarketTrend {
  id: string;
  make: string;
  model: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  priceChangePercent: number;
  demandIndex: number;
  demandChange: number;
  popularityRank: number;
  region: string;
  timeframe: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  volume: number;
  forecast: 'bullish' | 'bearish' | 'neutral';
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'price' | 'demand' | 'supply' | 'regulation';
  affectedBrands: string[];
  publishedAt: string;
}

export interface GlobalMarketData {
  totalVolume: number;
  averagePrice: number;
  topPerformers: string[];
  marketSentiment: 'positive' | 'negative' | 'neutral';
  volatilityIndex: number;
  lastUpdated: string;
}

export const useMarketTrends = () => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Simulate real-time market data fetching
  const fetchMarketTrends = async () => {
    try {
      setLoading(true);
      
      // In production, this would connect to automotive market APIs
      // Such as: AutoTrader API, Cars.com API, or custom market analysis services
      
      const mockTrends: MarketTrend[] = [
        {
          id: 'trend_001',
          make: 'Toyota',
          model: 'Land Cruiser',
          category: 'SUV',
          currentPrice: 4200000,
          previousPrice: 3900000,
          priceChange: 300000,
          priceChangePercent: 7.7,
          demandIndex: 92,
          demandChange: 15,
          popularityRank: 1,
          region: 'Kenya',
          timeframe: '30 days',
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          volume: 45,
          forecast: 'bullish'
        },
        {
          id: 'trend_002',
          make: 'Mercedes-Benz',
          model: 'E-Class',
          category: 'Luxury Sedan',
          currentPrice: 6800000,
          previousPrice: 6500000,
          priceChange: 300000,
          priceChangePercent: 4.6,
          demandIndex: 78,
          demandChange: 8,
          popularityRank: 3,
          region: 'East Africa',
          timeframe: '30 days',
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          volume: 23,
          forecast: 'bullish'
        },
        {
          id: 'trend_003',
          make: 'BMW',
          model: 'X5',
          category: 'Luxury SUV',
          currentPrice: 5500000,
          previousPrice: 5800000,
          priceChange: -300000,
          priceChangePercent: -5.2,
          demandIndex: 65,
          demandChange: -12,
          popularityRank: 5,
          region: 'Kenya',
          timeframe: '30 days',
          lastUpdated: new Date().toISOString(),
          trend: 'down',
          volume: 18,
          forecast: 'bearish'
        },
        {
          id: 'trend_004',
          make: 'Nissan',
          model: 'X-Trail',
          category: 'Compact SUV',
          currentPrice: 3200000,
          previousPrice: 2900000,
          priceChange: 300000,
          priceChangePercent: 10.3,
          demandIndex: 88,
          demandChange: 22,
          popularityRank: 2,
          region: 'Kenya',
          timeframe: '30 days',
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          volume: 67,
          forecast: 'bullish'
        },
        {
          id: 'trend_005',
          make: 'Honda',
          model: 'CR-V',
          category: 'Compact SUV',
          currentPrice: 3800000,
          previousPrice: 3750000,
          priceChange: 50000,
          priceChangePercent: 1.3,
          demandIndex: 72,
          demandChange: 3,
          popularityRank: 4,
          region: 'East Africa',
          timeframe: '30 days',
          lastUpdated: new Date().toISOString(),
          trend: 'stable',
          volume: 34,
          forecast: 'neutral'
        },
        {
          id: 'trend_006',
          make: 'Audi',
          model: 'Q7',
          category: 'Luxury SUV',
          currentPrice: 7200000,
          previousPrice: 7000000,
          priceChange: 200000,
          priceChangePercent: 2.9,
          demandIndex: 58,
          demandChange: 5,
          popularityRank: 6,
          region: 'Kenya',
          timeframe: '30 days',
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          volume: 12,
          forecast: 'neutral'
        }
      ];

      const mockInsights: MarketInsight[] = [
        {
          id: 'insight_001',
          title: 'SUV Demand Surge Continues',
          description: 'Compact and mid-size SUVs showing 15% increase in demand across East Africa',
          impact: 'high',
          category: 'demand',
          affectedBrands: ['Toyota', 'Nissan', 'Honda'],
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'insight_002',
          title: 'Hybrid Vehicle Interest Growing',
          description: 'Hybrid models seeing 28% increase in inquiries due to fuel efficiency concerns',
          impact: 'medium',
          category: 'demand',
          affectedBrands: ['Toyota', 'Honda', 'Lexus'],
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'insight_003',
          title: 'Import Duty Changes Expected',
          description: 'KRA considering adjustments to vehicle import duties in Q2 2024',
          impact: 'high',
          category: 'regulation',
          affectedBrands: ['All'],
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];

      const mockGlobalData: GlobalMarketData = {
        totalVolume: mockTrends.reduce((sum, trend) => sum + trend.volume, 0),
        averagePrice: mockTrends.reduce((sum, trend) => sum + trend.currentPrice, 0) / mockTrends.length,
        topPerformers: ['Toyota Land Cruiser', 'Nissan X-Trail', 'Mercedes-Benz E-Class'],
        marketSentiment: 'positive',
        volatilityIndex: 0.15, // 15% volatility
        lastUpdated: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setTrends(mockTrends);
      setInsights(mockInsights);
      setGlobalData(mockGlobalData);
      setLastUpdate(new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market trends');
      console.error('Error fetching market trends:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 2 minutes
  useEffect(() => {
    fetchMarketTrends();
    
    const interval = setInterval(() => {
      fetchMarketTrends();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (percent: number) => {
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  return {
    trends,
    insights,
    globalData,
    loading,
    error,
    lastUpdate,
    refetch: fetchMarketTrends,
    getTrendIcon,
    getTrendColor,
    getImpactColor,
    formatCurrency,
    formatPercentage
  };
};