import React, { useState } from 'react';
import { 
  Loader2, 
  Truck, 
  Star, 
  TrendingUp, 
  RefreshCw,
  Activity,
  Anchor,
  Ship,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useShipArrivals } from '../hooks/useShipArrivals';
import { useMarketTrends } from '../hooks/useMarketTrends';
import SearchBar from './SearchBar';
import VehicleCard from './VehicleCard';
import InquiryModal from './InquiryModal';

interface SearchFilters {
  make?: string;
  bodyType?: string;
  priceRange?: string;
  location?: string;
  fuelType?: string;
  transmission?: string;
  kenyaReady?: boolean;
  rhd?: boolean;
  searchQuery?: string;
}

const VehicleShowcase: React.FC = () => {
  const { vehicles, loading, fetchVehicles } = useVehicles();
  const { 
    arrivals, 
    portStats, 
    loading: arrivalsLoading, 
    lastUpdate: arrivalsLastUpdate,
    refetch: refetchArrivals,
    getStatusColor,
    getStatusIcon,
    formatETA
  } = useShipArrivals();
  
  const {
    trends,
    globalData,
    loading: trendsLoading,
    lastUpdate: trendsLastUpdate,
    refetch: refetchTrends,
    getTrendIcon,
    getTrendColor,
    formatCurrency,
    formatPercentage
  } = useMarketTrends();

  const [inquiryModal, setInquiryModal] = useState<{
    isOpen: boolean;
    vehicleId?: string;
    vehicleInfo?: { make: string; model: string; year: number; price: number };
  }>({ isOpen: false });

  const [autoRefresh] = useState(true);

  const handleSearch = (filters: SearchFilters) => {
    fetchVehicles(filters);
  };

  const handleInquire = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setInquiryModal({
      isOpen: true,
      vehicleId,
      vehicleInfo: vehicle ? {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
      } : undefined,
    });
  };

  const handleRefreshAll = () => {
    refetchArrivals();
    refetchTrends();
    fetchVehicles();
  };

  const formatLastUpdate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <section id="inventory" className="py-20 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl text-slate-900">
            Live Vehicle
            <span className="text-amber-500"> Inventory</span>
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-600">
            Real-time inventory with live arrivals from Japan, UK, and UAE ports.
            All vehicles verified and ready for import.
          </p>
          
          {/* Live Status Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Ship Tracking: {formatLastUpdate(arrivalsLastUpdate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Market Data: {formatLastUpdate(trendsLastUpdate)}</span>
            </div>
            <button
              onClick={handleRefreshAll}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh All</span>
            </button>
          </div>
        </div>

        {/* Enhanced Live Data Dashboard */}
        <div className="grid grid-cols-1 gap-6 mb-12 lg:grid-cols-4">
          {/* Live Ship Arrivals */}
          <div className="overflow-hidden bg-white shadow-lg lg:col-span-2 rounded-2xl">
            <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Ship className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">Live Ship Arrivals</h3>
                    <p className="text-blue-100">Real-time from Kenya Ports Authority</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{arrivals.length}</div>
                  <div className="text-sm text-blue-100">Active vessels</div>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {arrivalsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="w-6 h-6 mr-3 text-blue-500 animate-spin" />
                  <span className="text-gray-600">Loading live data...</span>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {arrivals.map((arrival) => (
                    <div key={arrival.id} className="p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getStatusIcon(arrival.status)}</div>
                          <div>
                            <h4 className="font-bold text-slate-900">{arrival.vesselName}</h4>
                            <p className="text-sm text-gray-600">{arrival.origin} → {arrival.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">{arrival.vehicleCount}</div>
                          <div className="text-xs text-gray-500">vehicles</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(arrival.status)}`}>
                            {arrival.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="flex items-center space-x-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>ETA: {formatETA(arrival.eta)}</span>
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 transition-all duration-300 bg-blue-500 rounded-full"
                              style={{ width: `${arrival.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{arrival.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Market Trends */}
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="p-6 text-white bg-gradient-to-r from-green-500 to-green-600">
              <div className="flex items-center mb-4 space-x-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Market Trends</h3>
                  <p className="text-green-100">Live price movements</p>
                </div>
              </div>
              {globalData && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-green-100">Avg Price</div>
                    <div className="font-bold">{formatCurrency(globalData.averagePrice)}</div>
                  </div>
                  <div>
                    <div className="text-green-100">Sentiment</div>
                    <div className="font-bold capitalize">{globalData.marketSentiment}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {trendsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="w-6 h-6 mr-3 text-green-500 animate-spin" />
                  <span className="text-gray-600">Loading trends...</span>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {trends.slice(0, 6).map((trend) => (
                    <div key={trend.id} className="p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTrendIcon(trend.trend)}</span>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {trend.make} {trend.model}
                            </div>
                            <div className="text-xs text-gray-600">{trend.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${getTrendColor(trend.trend)}`}>
                            {formatPercentage(trend.priceChangePercent)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(trend.currentPrice)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Demand Indicator */}
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full">
                          <div 
                            className="h-1 transition-all duration-300 bg-green-500 rounded-full"
                            style={{ width: `${trend.demandIndex}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">Demand: {trend.demandIndex}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Port Statistics */}
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="p-6 text-white bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="flex items-center mb-4 space-x-3">
                <Anchor className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Port Status</h3>
                  <p className="text-purple-100">Mombasa Port KPA</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {portStats ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">Total Arrivals</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{portStats.totalArrivals}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">Vehicles in Port</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{portStats.vehiclesInPort}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">Avg Clearance</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{portStats.averageClearanceTime} days</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Port Congestion</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        portStats.portCongestion === 'low' ? 'bg-green-100 text-green-800' :
                        portStats.portCongestion === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {portStats.portCongestion.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Loading port data...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {loading ? 'Searching...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} available`}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Real-time inventory</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-amber-500 animate-spin" />
                <p className="text-gray-600">Loading latest inventory...</p>
              </div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center w-24 h-24 p-8 mx-auto mb-6 bg-gray-100 rounded-full">
                <span className="text-4xl">🚗</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">No vehicles found</h3>
              <p className="mb-6 text-gray-600">Try adjusting your search filters or check our live arrivals above for upcoming inventory.</p>
              <button
                onClick={() => handleSearch({})}
                className="px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-amber-500 hover:bg-amber-600"
              >
                View All Vehicles
              </button>
            </div>
          ) : (
            <>
              {/* Featured/Premium Vehicles */}
              {vehicles.slice(0, 3).length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-6 space-x-3">
                    <Star className="w-6 h-6 text-amber-500" />
                    <h3 className="text-2xl font-bold text-slate-900">Featured Vehicles</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-amber-600">Just Arrived</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.slice(0, 3).map((vehicle) => (
                      <div key={vehicle.id} className="relative">
                        <div className="absolute z-10 -top-2 -right-2">
                          <span className="px-3 py-1 text-sm font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-600">
                            ⭐ Featured
                          </span>
                        </div>
                        <VehicleCard
                          vehicle={vehicle}
                          onInquire={handleInquire}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Vehicles */}
              <div>
                <h3 className="mb-6 text-2xl font-bold text-slate-900">All Available Vehicles</h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onInquire={handleInquire}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Real-time Updates Notice */}
        <div className="p-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-2xl">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4 space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="text-2xl font-bold text-slate-900">Live Inventory System</h4>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <p className="mb-6 text-lg text-gray-700">
              Our inventory updates in real-time with arrivals from Japan, UK, and UAE. 
              Prices and availability reflect current market conditions and shipping costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center mb-3 space-x-3">
                <Ship className="w-8 h-8 text-blue-500" />
                <h5 className="font-bold text-slate-900">Live Ship Tracking</h5>
              </div>
              <p className="text-sm text-gray-600">
                Real-time vessel positions and arrival updates from Kenya Ports Authority
              </p>
            </div>
            
            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center mb-3 space-x-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <h5 className="font-bold text-slate-900">Market Price Updates</h5>
              </div>
              <p className="text-sm text-gray-600">
                Dynamic pricing based on current market trends and demand analysis
              </p>
            </div>
            
            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center mb-3 space-x-3">
                <CheckCircle className="w-8 h-8 text-purple-500" />
                <h5 className="font-bold text-slate-900">Port Clearance Status</h5>
              </div>
              <p className="text-sm text-gray-600">
                Live updates on customs clearance and vehicle availability
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {formatLastUpdate(arrivalsLastUpdate)} • 
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'} • 
              Next update in: 30 seconds
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModal.isOpen}
        onClose={() => setInquiryModal({ isOpen: false })}
        vehicleId={inquiryModal.vehicleId}
        vehicleInfo={inquiryModal.vehicleInfo}
      />
    </section>
  );
};

export default VehicleShowcase;