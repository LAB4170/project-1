import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

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

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const makes = ['Toyota', 'Mercedes-Benz', 'BMW', 'Nissan', 'Audi', 'Honda', 'Volkswagen', 'Mazda', 'Subaru', 'Mitsubishi'];
  const bodyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'suv', label: 'SUV' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'wagon', label: 'Station Wagon' },
    { value: 'coupe', label: 'Coupe' },
    { value: 'pickup', label: 'Pickup' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under2m', label: 'Under 2M' },
    { value: '2m-4m', label: '2M - 4M' },
    { value: 'above4m', label: 'Above 4M' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Japan', label: 'Japan' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'UAE', label: 'UAE' },
  ];

  const fuelTypes = [
    { value: 'all', label: 'All Fuel Types' },
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Electric', label: 'Electric' },
  ];

  const transmissions = [
    { value: 'all', label: 'All Transmissions' },
    { value: 'Automatic', label: 'Automatic' },
    { value: 'Manual', label: 'Manual' },
    { value: 'CVT', label: 'CVT' },
  ];

  const handleSearch = () => {
    const searchFilters: SearchFilters = {
      ...filters,
      searchQuery: searchQuery.trim() || undefined,
    };
    onSearch(searchFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    onSearch({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined) || searchQuery.trim();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // Always trigger search, even with empty query to show all results
      handleSearch();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, or keywords (e.g., Toyota Prado, BMW X5)"
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
              showFilters || hasActiveFilters
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-white text-amber-500 rounded-full px-2 py-1 text-xs font-bold">
                {Object.values(filters).filter(v => v !== undefined).length + (searchQuery.trim() ? 1 : 0)}
              </span>
            )}
          </button>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {/* Make Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
              <select
                value={filters.make || ''}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Makes</option>
                {makes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {/* Body Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Body Type</label>
              <select
                value={filters.bodyType || 'all'}
                onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {bodyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange || 'all'}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Origin</label>
              <select
                value={filters.location || 'all'}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
              <select
                value={filters.fuelType || 'all'}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
              <select
                value={filters.transmission || 'all'}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {transmissions.map(trans => (
                  <option key={trans.value} value={trans.value}>{trans.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.kenyaReady || false}
                onChange={(e) => handleFilterChange('kenyaReady', e.target.checked || undefined)}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium text-gray-700">Kenya Ready Only</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.rhd || false}
                onChange={(e) => handleFilterChange('rhd', e.target.checked || undefined)}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium text-gray-700">Right Hand Drive Only</span>
            </label>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>

            <div className="text-sm text-gray-500">
              {hasActiveFilters && (
                <span>
                  {Object.values(filters).filter(v => v !== undefined).length + (searchQuery.trim() ? 1 : 0)} filter(s) applied
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;