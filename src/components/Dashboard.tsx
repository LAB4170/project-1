import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Car, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Bell, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Heart,
  Phone,
  Mail,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useDeals } from '../hooks/useDeals';
import { useReviews } from '../hooks/useReviews';
import { useChat } from '../hooks/useChat';
import AdminChatPanel from './AdminChatPanel';
import { supabase } from '../lib/supabase';

interface Analytics {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  totalValue: number;
  averagePrice: number;
  newArrivalsThisMonth: number;
  salesThisMonth: number;
  conversionRate: number;
  topMakes: { make: string; count: number; value: number }[];
  monthlyData: { month: string; arrivals: number; sales: number; revenue: number }[];
  locationStats: { location: string; count: number; percentage: number }[];
  priceRanges: { range: string; count: number; percentage: number }[];
}

const Dashboard: React.FC = () => {
  const { vehicles } = useVehicles();
  const { deals } = useDeals();
  const { reviews } = useReviews();
  const { conversations, totalUnreadCount } = useChat();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  // Calculate analytics from vehicles data
  useEffect(() => {
    if (vehicles.length > 0) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const available = vehicles.filter(v => v.status === 'available').length;
      const sold = vehicles.filter(v => v.status === 'sold').length;
      const reserved = vehicles.filter(v => v.status === 'reserved').length;
      
      const totalValue = vehicles.reduce((sum, v) => sum + v.price, 0);
      const averagePrice = totalValue / vehicles.length;
      
      const newArrivals = vehicles.filter(v => 
        new Date(v.created_at) >= thirtyDaysAgo
      ).length;
      
      const salesThisMonth = vehicles.filter(v => 
        v.status === 'sold' && new Date(v.updated_at || v.created_at) >= thirtyDaysAgo
      ).length;
      
      const conversionRate = vehicles.length > 0 ? (sold / vehicles.length) * 100 : 0;
      
      // Top makes analysis
      const makeStats = vehicles.reduce((acc, v) => {
        if (!acc[v.make]) {
          acc[v.make] = { count: 0, value: 0 };
        }
        acc[v.make].count++;
        acc[v.make].value += v.price;
        return acc;
      }, {} as Record<string, { count: number; value: number }>);
      
      const topMakes = Object.entries(makeStats)
        .map(([make, stats]) => ({ make, ...stats }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Location stats
      const locationStats = vehicles.reduce((acc, v) => {
        acc[v.location] = (acc[v.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const locationData = Object.entries(locationStats).map(([location, count]) => ({
        location,
        count,
        percentage: (count / vehicles.length) * 100
      }));
      
      // Price ranges
      const priceRanges = [
        { range: 'Under 2M', min: 0, max: 2000000 },
        { range: '2M - 4M', min: 2000000, max: 4000000 },
        { range: '4M - 6M', min: 4000000, max: 6000000 },
        { range: 'Above 6M', min: 6000000, max: Infinity }
      ];
      
      const priceRangeData = priceRanges.map(range => {
        const count = vehicles.filter(v => v.price >= range.min && v.price < range.max).length;
        return {
          range: range.range,
          count,
          percentage: (count / vehicles.length) * 100
        };
      });
      
      // Mock monthly data (in real app, this would come from database)
      const monthlyData = [
        { month: 'Jan', arrivals: 12, sales: 8, revenue: 24000000 },
        { month: 'Feb', arrivals: 15, sales: 11, revenue: 31000000 },
        { month: 'Mar', arrivals: 18, sales: 14, revenue: 42000000 },
        { month: 'Apr', arrivals: 22, sales: 16, revenue: 48000000 },
        { month: 'May', arrivals: 25, sales: 19, revenue: 57000000 },
        { month: 'Jun', arrivals: newArrivals, sales: salesThisMonth, revenue: sold * averagePrice }
      ];
      
      setAnalytics({
        totalVehicles: vehicles.length,
        availableVehicles: available,
        soldVehicles: sold,
        reservedVehicles: reserved,
        totalValue,
        averagePrice,
        newArrivalsThisMonth: newArrivals,
        salesThisMonth,
        conversionRate,
        topMakes,
        monthlyData,
        locationStats: locationData,
        priceRanges: priceRangeData
      });
    }
  }, [vehicles]);

  // Set loading to false when data is available
  useEffect(() => {
    if (vehicles.length >= 0 && conversations.length >= 0) {
      setLoading(false);
    }
  }, [vehicles, conversations]);

  const formatCurrency = (amount: number) => {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'contacted': return <Clock className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Filter */}
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          {/* Messages Button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {totalUnreadCount}
              </span>
            )}
          </button>
          
          {/* Export Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Inventory</p>
              <p className="text-3xl font-bold">{analytics?.totalVehicles || 0}</p>
              <p className="text-blue-100 text-sm mt-1">
                {analytics?.availableVehicles || 0} available
              </p>
            </div>
            <Car className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Value</p>
              <p className="text-3xl font-bold">{formatCurrency(analytics?.totalValue || 0)}</p>
              <p className="text-green-100 text-sm mt-1">
                Avg: {formatCurrency(analytics?.averagePrice || 0)}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Sales This Month</p>
              <p className="text-3xl font-bold">{analytics?.salesThisMonth || 0}</p>
              <p className="text-purple-100 text-sm mt-1">
                {analytics?.conversionRate.toFixed(1)}% conversion
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Customer Reviews</p>
              <p className="text-3xl font-bold">{reviews.length}</p>
              <p className="text-amber-100 text-sm mt-1">Total reviews</p>
            </div>
            <Activity className="w-12 h-12 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Performance Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Monthly Performance</h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics?.monthlyData.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{month.arrivals} arrivals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{month.sales} sales</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatCurrency(month.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Makes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Top Performing Makes</h3>
            <PieChart className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics?.topMakes.map((make, index) => (
              <div key={make.make} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{make.make}</div>
                    <div className="text-sm text-gray-600">{make.count} vehicles</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{formatCurrency(make.value)}</div>
                  <div className="text-sm text-gray-600">Total value</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Location Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Origin Countries</h3>
            <MapPin className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics?.locationStats.map((location) => (
              <div key={location.location} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{location.location}</span>
                  <span className="text-sm text-gray-600">{location.count} ({location.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Price Ranges</h3>
            <Target className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics?.priceRanges.map((range) => (
              <div key={range.range} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{range.range}</span>
                  <span className="text-sm text-gray-600">{range.count} ({range.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${range.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Quick Stats</h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Available</span>
              </div>
              <span className="text-lg font-bold text-slate-900">{analytics?.availableVehicles}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Reserved</span>
              </div>
              <span className="text-lg font-bold text-slate-900">{analytics?.reservedVehicles}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Sold</span>
              </div>
              <span className="text-lg font-bold text-slate-900">{analytics?.soldVehicles}</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Active Chats</span>
                <span className="text-lg font-bold text-amber-600">{conversations.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <AdminChatPanel />
      )}
    </div>
  );
};

export default Dashboard;