import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Globe, 
  Car, 
  DollarSign, 
  Calendar,
  Bell,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Fuel,
  Settings2
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: 'release' | 'news' | 'recall' | 'trend';
  manufacturer: string;
  imageUrl: string;
  url: string;
  impact: 'high' | 'medium' | 'low';
}

interface MarketTrend {
  id: string;
  make: string;
  model: string;
  trend: 'up' | 'down' | 'stable';
  priceChange: number;
  demandChange: number;
  region: string;
  timeframe: string;
}

interface ManufacturerData {
  name: string;
  logo: string;
  marketShare: number;
  avgPrice: number;
  popularModels: string[];
  recentNews: number;
  trend: 'up' | 'down' | 'stable';
}

const MarketIntelligence: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [manufacturers, setManufacturers] = useState<ManufacturerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock real-time data (in production, this would connect to automotive APIs)
  useEffect(() => {
    const fetchMarketData = () => {
      // Mock automotive news data
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Toyota Announces New Hybrid Technology for 2024 Models',
          summary: 'Revolutionary fuel efficiency improvements expected to reduce consumption by 25%',
          source: 'Toyota Motor Corporation',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: 'release',
          manufacturer: 'Toyota',
          imageUrl: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
          url: '#',
          impact: 'high'
        },
        {
          id: '2',
          title: 'Mercedes-Benz EQS Sets New Electric Range Record',
          summary: 'Latest EQS model achieves 700km range on single charge, leading luxury EV market',
          source: 'Mercedes-Benz AG',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'news',
          manufacturer: 'Mercedes-Benz',
          imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
          url: '#',
          impact: 'high'
        },
        {
          id: '3',
          title: 'BMW Recalls 50,000 Units Due to Software Issue',
          summary: 'Voluntary recall affects 2023 X5 and X7 models for infotainment system update',
          source: 'BMW Group',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          category: 'recall',
          manufacturer: 'BMW',
          imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
          url: '#',
          impact: 'medium'
        },
        {
          id: '4',
          title: 'Global SUV Demand Surges 15% in Q4 2024',
          summary: 'Market analysis shows continued preference for SUVs across all price segments',
          source: 'Automotive Market Research',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          category: 'trend',
          manufacturer: 'Industry',
          imageUrl: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
          url: '#',
          impact: 'high'
        },
        {
          id: '5',
          title: 'Nissan Unveils Next-Generation Autonomous Driving',
          summary: 'ProPILOT 3.0 technology promises Level 4 autonomy for highway driving',
          source: 'Nissan Motor Co.',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          category: 'release',
          manufacturer: 'Nissan',
          imageUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
          url: '#',
          impact: 'high'
        }
      ];

      // Mock market trends
      const mockTrends: MarketTrend[] = [
        {
          id: '1',
          make: 'Toyota',
          model: 'Land Cruiser',
          trend: 'up',
          priceChange: 8.5,
          demandChange: 12.3,
          region: 'Kenya',
          timeframe: '30 days'
        },
        {
          id: '2',
          make: 'Mercedes-Benz',
          model: 'E-Class',
          trend: 'up',
          priceChange: 5.2,
          demandChange: 7.8,
          region: 'East Africa',
          timeframe: '30 days'
        },
        {
          id: '3',
          make: 'BMW',
          model: 'X5',
          trend: 'down',
          priceChange: -3.1,
          demandChange: -5.4,
          region: 'Kenya',
          timeframe: '30 days'
        },
        {
          id: '4',
          make: 'Audi',
          model: 'Q7',
          trend: 'stable',
          priceChange: 1.2,
          demandChange: 2.1,
          region: 'East Africa',
          timeframe: '30 days'
        }
      ];

      // Mock manufacturer data
      const mockManufacturers: ManufacturerData[] = [
        {
          name: 'Toyota',
          logo: '🚗',
          marketShare: 28.5,
          avgPrice: 3200000,
          popularModels: ['Land Cruiser', 'Prado', 'Camry'],
          recentNews: 12,
          trend: 'up'
        },
        {
          name: 'Mercedes-Benz',
          logo: '⭐',
          marketShare: 18.2,
          avgPrice: 5800000,
          popularModels: ['E-Class', 'C-Class', 'GLE'],
          recentNews: 8,
          trend: 'up'
        },
        {
          name: 'BMW',
          logo: '🔷',
          marketShare: 15.7,
          avgPrice: 5200000,
          popularModels: ['X5', '3 Series', 'X3'],
          recentNews: 6,
          trend: 'stable'
        },
        {
          name: 'Audi',
          logo: '🔴',
          marketShare: 12.1,
          avgPrice: 4900000,
          popularModels: ['Q7', 'A4', 'Q5'],
          recentNews: 4,
          trend: 'up'
        },
        {
          name: 'Nissan',
          logo: '🌟',
          marketShare: 10.8,
          avgPrice: 2800000,
          popularModels: ['X-Trail', 'Patrol', 'Altima'],
          recentNews: 7,
          trend: 'stable'
        }
      ];

      setNewsItems(mockNews);
      setMarketTrends(mockTrends);
      setManufacturers(mockManufacturers);
      setLoading(false);
    };

    fetchMarketData();

    // Auto-refresh every 5 minutes if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesManufacturer = selectedManufacturer === 'all' || item.manufacturer === selectedManufacturer;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesManufacturer && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'release': return <Zap className="w-4 h-4" />;
      case 'news': return <Globe className="w-4 h-4" />;
      case 'recall': return <AlertTriangle className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'release': return 'bg-green-100 text-green-800';
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'recall': return 'bg-red-100 text-red-800';
      case 'trend': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading market intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Market Intelligence</h1>
          <p className="text-gray-600 mt-1">Real-time automotive industry insights and trends</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Market Growth</p>
              <p className="text-3xl font-bold">+12.5%</p>
              <p className="text-green-100 text-sm mt-1">This quarter</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active News</p>
              <p className="text-3xl font-bold">{newsItems.length}</p>
              <p className="text-blue-100 text-sm mt-1">Last 24 hours</p>
            </div>
            <Globe className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Trending Models</p>
              <p className="text-3xl font-bold">{marketTrends.filter(t => t.trend === 'up').length}</p>
              <p className="text-purple-100 text-sm mt-1">Price increases</p>
            </div>
            <Target className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Manufacturers</p>
              <p className="text-3xl font-bold">{manufacturers.length}</p>
              <p className="text-amber-100 text-sm mt-1">Tracked brands</p>
            </div>
            <Award className="w-12 h-12 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, trends, or manufacturers..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="release">New Releases</option>
            <option value="news">Industry News</option>
            <option value="recall">Recalls</option>
            <option value="trend">Market Trends</option>
          </select>
          
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map(manufacturer => (
              <option key={manufacturer.name} value={manufacturer.name}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Latest Industry News</h2>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {filteredNews.length} articles
                </span>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredNews.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No news found matching your filters</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNews.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex space-x-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-2 ml-4">
                              <div className={`w-3 h-3 rounded-full ${getImpactColor(item.impact)}`}></div>
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                {getCategoryIcon(item.category)}
                                <span className="ml-1 capitalize">{item.category}</span>
                              </span>
                              <span className="text-xs text-gray-500">{item.manufacturer}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(item.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Trends */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Market Trends</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {marketTrends.map((trend) => (
                <div key={trend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(trend.trend)}
                    <div>
                      <div className="font-semibold text-sm text-slate-900">
                        {trend.make} {trend.model}
                      </div>
                      <div className="text-xs text-gray-600">{trend.region}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      trend.priceChange > 0 ? 'text-green-600' : 
                      trend.priceChange < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend.priceChange > 0 ? '+' : ''}{trend.priceChange}%
                    </div>
                    <div className="text-xs text-gray-500">price</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Manufacturers */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Top Manufacturers</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {manufacturers.map((manufacturer, index) => (
                <div key={manufacturer.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">
                        {manufacturer.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {manufacturer.marketShare}% market share
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(manufacturer.avgPrice)}
                    </div>
                    <div className="text-xs text-gray-500">avg price</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-6">Market Pulse</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Rising Demand</span>
                </div>
                <span className="text-lg font-bold text-green-400">+15%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Hybrid Interest</span>
                </div>
                <span className="text-lg font-bold text-blue-400">+28%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Import Volume</span>
                </div>
                <span className="text-lg font-bold text-purple-400">+8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;