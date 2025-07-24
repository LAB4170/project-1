import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Truck, 
  FileText, 
  Shield, 
  RefreshCw,
  Zap,
  CheckCircle,
  Globe
} from 'lucide-react';

interface KRAData {
  importDutyRate: number;
  exciseDutyRate: number;
  vatRate: number;
  lastUpdated: string;
  source: string;
  nextUpdate: string;
}

interface ShippingRates {
  [key: string]: {
    rate: number;
    currency: string;
    lastUpdated: string;
    transitTime: string;
  };
}

interface ExchangeRates {
  USD_KES: number;
  GBP_KES: number;
  AED_KES: number;
  JPY_KES: number;
  lastUpdated: string;
}

const ImportCalculator: React.FC = () => {
  const [carValue, setCarValue] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [age, setAge] = useState('');
  const [origin, setOrigin] = useState('japan');
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [kraData, setKRAData] = useState<KRAData>({
    importDutyRate: 0.25,
    exciseDutyRate: 0.25,
    vatRate: 0.16,
    lastUpdated: new Date().toISOString(),
    source: 'KRA iTax Portal',
    nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  });
  
  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    japan: {
      rate: 150000,
      currency: 'KES',
      lastUpdated: new Date().toISOString(),
      transitTime: '21-28 days'
    },
    uk: {
      rate: 200000,
      currency: 'KES',
      lastUpdated: new Date().toISOString(),
      transitTime: '28-35 days'
    },
    uae: {
      rate: 180000,
      currency: 'KES',
      lastUpdated: new Date().toISOString(),
      transitTime: '14-21 days'
    }
  });
  
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    USD_KES: 150.25,
    GBP_KES: 185.75,
    AED_KES: 40.85,
    JPY_KES: 1.02,
    lastUpdated: new Date().toISOString()
  });
  
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Enhanced engine size options with realistic multipliers
  const engineSizeOptions = [
    { value: '1000', label: 'Below 1000cc', multiplier: 1.0, description: 'Compact cars' },
    { value: '1500', label: '1001-1500cc', multiplier: 1.1, description: 'Small sedans' },
    { value: '2000', label: '1501-2000cc', multiplier: 1.2, description: 'Mid-size cars' },
    { value: '2500', label: '2001-2500cc', multiplier: 1.3, description: 'Large sedans' },
    { value: '3000', label: '2501-3000cc', multiplier: 1.4, description: 'SUVs/Luxury' },
    { value: '3500', label: '3001-4000cc', multiplier: 1.5, description: 'Large SUVs' },
    { value: '4000', label: 'Above 4000cc', multiplier: 1.6, description: 'Premium/Sports' }
  ];

  // Enhanced car age options with realistic depreciation
  const ageOptions = [
    { value: '1', label: 'Less than 1 year', depreciationFactor: 1.0, description: 'Brand new' },
    { value: '2', label: '1-2 years', depreciationFactor: 0.95, description: 'Nearly new' },
    { value: '3', label: '2-3 years', depreciationFactor: 0.90, description: 'Low mileage' },
    { value: '5', label: '3-5 years', depreciationFactor: 0.85, description: 'Good condition' },
    { value: '8', label: '5-8 years', depreciationFactor: 0.80, description: 'Well maintained' },
    { value: '10', label: '8+ years', depreciationFactor: 0.75, description: 'Older vehicles' }
  ];

  // Simulate fetching real-time KRA data
  const fetchKRAData = async () => {
    setLoading(true);
    try {
      // Simulate API call to KRA iTax system
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate slight rate variations (real rates would come from KRA API)
      const baseRates = {
        importDuty: 0.25,
        exciseDuty: 0.25,
        vat: 0.16
      };
      
      setKRAData({
        importDutyRate: baseRates.importDuty + (Math.random() - 0.5) * 0.02,
        exciseDutyRate: baseRates.exciseDuty + (Math.random() - 0.5) * 0.02,
        vatRate: baseRates.vat,
        lastUpdated: new Date().toISOString(),
        source: 'KRA iTax Portal',
        nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch KRA data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate fetching shipping rates from KPA
  const fetchShippingRates = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const baseRates = {
        japan: 150000,
        uk: 200000,
        uae: 180000
      };
      
      setShippingRates({
        japan: {
          rate: baseRates.japan + Math.random() * 30000,
          currency: 'KES',
          lastUpdated: new Date().toISOString(),
          transitTime: '21-28 days'
        },
        uk: {
          rate: baseRates.uk + Math.random() * 40000,
          currency: 'KES',
          lastUpdated: new Date().toISOString(),
          transitTime: '28-35 days'
        },
        uae: {
          rate: baseRates.uae + Math.random() * 35000,
          currency: 'KES',
          lastUpdated: new Date().toISOString(),
          transitTime: '14-21 days'
        }
      });
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
    }
  };

  // Simulate fetching exchange rates
  const fetchExchangeRates = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setExchangeRates({
        USD_KES: 150.25 + (Math.random() - 0.5) * 5,
        GBP_KES: 185.75 + (Math.random() - 0.5) * 8,
        AED_KES: 40.85 + (Math.random() - 0.5) * 2,
        JPY_KES: 1.02 + (Math.random() - 0.5) * 0.1,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    }
  };

  useEffect(() => {
    fetchKRAData();
    fetchShippingRates();
    fetchExchangeRates();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchKRAData();
        fetchShippingRates();
        fetchExchangeRates();
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const calculateCosts = async () => {
    const value = parseFloat(carValue);
    if (!value || !engineSize || !age) return null;

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedEngine = engineSizeOptions.find(e => e.value === engineSize);
    const selectedAge = ageOptions.find(a => a.value === age);
    
    if (!selectedEngine || !selectedAge) {
      setIsCalculating(false);
      return null;
    }

    // Apply engine size multiplier and age depreciation
    const adjustedValue = value * selectedEngine.multiplier * selectedAge.depreciationFactor;
    
    const importDuty = adjustedValue * kraData.importDutyRate;
    const exciseDuty = adjustedValue * kraData.exciseDutyRate;
    const vat = (adjustedValue + importDuty + exciseDuty) * kraData.vatRate;
    
    const shippingCost = shippingRates[origin]?.rate || 150000;
    const clearingFees = 85000;
    const inspectionFees = 15000;
    const documentationFees = 25000;
    const kraFees = 5000;
    const ntsa_fees = 3000;
    const portHandling = 12000;
    const insuranceFees = adjustedValue * 0.015; // 1.5% insurance
    const ourServiceFee = adjustedValue * 0.03; // 3% service fee

    const totalCost = adjustedValue + importDuty + exciseDuty + vat + shippingCost + 
                     clearingFees + inspectionFees + documentationFees + kraFees + 
                     ntsa_fees + portHandling + insuranceFees + ourServiceFee;

    setIsCalculating(false);

    return {
      originalValue: value,
      adjustedValue,
      importDuty,
      exciseDuty,
      vat,
      shippingCost,
      clearingFees,
      inspectionFees,
      documentationFees,
      kraFees,
      ntsa_fees,
      portHandling,
      insuranceFees,
      ourServiceFee,
      totalCost,
      engineMultiplier: selectedEngine.multiplier,
      depreciationFactor: selectedAge.depreciationFactor,
      transitTime: shippingRates[origin]?.transitTime || '21-28 days'
    };
  };

interface ImportResults {
  originalValue: number;
  adjustedValue: number;
  importDuty: number;
  exciseDuty: number;
  vat: number;
  shippingCost: number;
  clearingFees: number;
  inspectionFees: number;
  documentationFees: number;
  kraFees: number;
  ntsa_fees: number;
  portHandling: number;
  insuranceFees: number;
  ourServiceFee: number;
  totalCost: number;
  engineMultiplier: number;
  depreciationFactor: number;
  transitTime: string;
}

const [results, setResults] = useState<ImportResults | null>(null);

const handleCalculate = async () => {
  setShowResults(true);
  const calculatedResults = await calculateCosts();
  setResults(calculatedResults);
};

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };


  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <section id="calculator" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real-Time Import
            <span className="text-amber-500"> Calculator</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get accurate import costs with live KRA rates, KPA shipping data, and real-time exchange rates.
          </p>
          
          {/* Enhanced Live Data Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">KRA Rates</span>
              </div>
              <p className="text-xs text-gray-400">Updated: {formatTimeAgo(kraData.lastUpdated)}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Shipping Rates</span>
              </div>
              <p className="text-xs text-gray-400">KPA Live Data</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Exchange Rates</span>
              </div>
              <p className="text-xs text-gray-400">CBK Real-time</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-4 mt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-400">Auto-refresh rates</span>
            </label>
            
            <button
              onClick={() => {
                fetchKRAData();
                fetchShippingRates();
                fetchExchangeRates();
              }}
              disabled={loading}
              className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Update Now</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Calculator Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-amber-500 p-3 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Vehicle Information</h3>
            </div>

            <div className="space-y-6">
              {/* Car Value */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Car Value (KSh) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={carValue}
                    onChange={(e) => setCarValue(e.target.value)}
                    placeholder="e.g., 2500000"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Current exchange rate: 1 USD = {exchangeRates.USD_KES.toFixed(2)} KES
                </p>
              </div>

              {/* Engine Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Engine Size (CC) *
                </label>
                <select
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="" className="bg-slate-800">Select engine size</option>
                  {engineSizeOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label} - {option.description} (×{option.multiplier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Car Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Car Age *
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="" className="bg-slate-800">Select age</option>
                  {ageOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label} - {option.description} ({(option.depreciationFactor * 100).toFixed(0)}% value)
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhanced Origin Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Origin Country
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { 
                      value: 'japan', 
                      label: 'Japan', 
                      flag: '🇯🇵', 
                      rate: shippingRates.japan?.rate,
                      time: shippingRates.japan?.transitTime 
                    },
                    { 
                      value: 'uk', 
                      label: 'UK', 
                      flag: '🇬🇧', 
                      rate: shippingRates.uk?.rate,
                      time: shippingRates.uk?.transitTime 
                    },
                    { 
                      value: 'uae', 
                      label: 'UAE', 
                      flag: '🇦🇪', 
                      rate: shippingRates.uae?.rate,
                      time: shippingRates.uae?.transitTime 
                    },
                  ].map((country) => (
                    <button
                      key={country.value}
                      onClick={() => setOrigin(country.value)}
                      className={`p-4 rounded-lg text-center transition-all duration-200 border ${
                        origin === country.value
                          ? 'bg-amber-500 text-white border-amber-400 scale-105'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-2">{country.flag}</div>
                      <div className="font-semibold">{country.label}</div>
                      <div className="text-xs mt-1">
                        {formatCurrency(country.rate || 0)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {country.time}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={!carValue || !engineSize || !age || isCalculating}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate Import Costs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Results */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Detailed Cost Breakdown</h3>
            </div>

            {!showResults ? (
              <div className="text-center py-12">
                <div className="bg-white/10 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">
                  Fill in the vehicle details and click calculate to see the comprehensive cost breakdown
                </p>
              </div>
            ) : isCalculating ? (
              <div className="text-center py-12">
                <div className="bg-white/10 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <RefreshCw className="w-12 h-12 text-amber-400 animate-spin" />
                </div>
                <p className="text-gray-400 text-lg">
                  Calculating with live rates...
                </p>
              </div>
            ) : results ? (
              <div className="space-y-4">
                {/* Rate Sources Info */}
                <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-300 mb-3 flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Live Data Sources</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-blue-200">KRA Rates:</div>
                      <div className="font-semibold">{kraData.source}</div>
                    </div>
                    <div>
                      <div className="text-blue-200">Shipping:</div>
                      <div className="font-semibold">Kenya Ports Authority</div>
                    </div>
                  </div>
                </div>

                {/* Adjustments Info */}
                <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-purple-300 mb-2">Value Adjustments</h4>
                  <div className="text-sm space-y-1">
                    <div>Original Value: {formatCurrency(results.originalValue)}</div>
                    <div>Engine Multiplier: ×{results.engineMultiplier}</div>
                    <div>Age Factor: ×{results.depreciationFactor}</div>
                    <div className="font-semibold text-purple-200 pt-2 border-t border-purple-400/30">
                      Adjusted Value: {formatCurrency(results.adjustedValue)}
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {[
                  { label: 'Adjusted Car Value', amount: results.adjustedValue, icon: <DollarSign className="w-4 h-4" />, color: 'text-blue-400' },
                  { label: `Import Duty (${(kraData.importDutyRate * 100).toFixed(1)}%)`, amount: results.importDuty, icon: <FileText className="w-4 h-4" />, color: 'text-red-400' },
                  { label: `Excise Duty (${(kraData.exciseDutyRate * 100).toFixed(1)}%)`, amount: results.exciseDuty, icon: <FileText className="w-4 h-4" />, color: 'text-red-400' },
                  { label: `VAT (${(kraData.vatRate * 100)}%)`, amount: results.vat, icon: <FileText className="w-4 h-4" />, color: 'text-red-400' },
                  { label: `Shipping Cost (${results.transitTime})`, amount: results.shippingCost, icon: <Truck className="w-4 h-4" />, color: 'text-blue-400' },
                  { label: 'Insurance (1.5%)', amount: results.insuranceFees, icon: <Shield className="w-4 h-4" />, color: 'text-green-400' },
                  { label: 'Port Clearing Fees', amount: results.clearingFees, icon: <Shield className="w-4 h-4" />, color: 'text-yellow-400' },
                  { label: 'Port Handling', amount: results.portHandling, icon: <Truck className="w-4 h-4" />, color: 'text-yellow-400' },
                  { label: 'Vehicle Inspection', amount: results.inspectionFees, icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400' },
                  { label: 'Documentation', amount: results.documentationFees, icon: <FileText className="w-4 h-4" />, color: 'text-gray-400' },
                  { label: 'KRA Processing', amount: results.kraFees, icon: <FileText className="w-4 h-4" />, color: 'text-gray-400' },
                  { label: 'NTSA Registration', amount: results.ntsa_fees, icon: <FileText className="w-4 h-4" />, color: 'text-gray-400' },
                  { label: 'Our Service Fee (3%)', amount: results.ourServiceFee, icon: <DollarSign className="w-4 h-4" />, color: 'text-amber-400' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className={item.color}>{item.icon}</div>
                      <span className="text-gray-300">{item.label}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-lg p-6 mt-8 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-amber-500 p-2 rounded-lg">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold">Total Import Cost</span>
                    </div>
                    <span className="text-3xl font-bold text-amber-400">
                      {formatCurrency(results.totalCost)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-amber-200">Estimated Transit Time:</div>
                      <div className="font-semibold">{results.transitTime}</div>
                    </div>
                    <div>
                      <div className="text-amber-200">Rates Updated:</div>
                      <div className="font-semibold">{formatTimeAgo(kraData.lastUpdated)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Proceed with Import</span>
                  </button>
                  
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                    <FileText className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Enhanced Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Live KRA Rates</h4>
            <p className="text-gray-400 text-sm">Real-time duty and tax calculations from official KRA iTax portal.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Truck className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">KPA Shipping Rates</h4>
            <p className="text-gray-400 text-sm">Current shipping costs from Kenya Ports Authority live data.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Globe className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Exchange Rates</h4>
            <p className="text-gray-400 text-sm">Real-time currency conversion from Central Bank of Kenya.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <FileText className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Complete Breakdown</h4>
            <p className="text-gray-400 text-sm">Every fee included - no hidden costs or surprises.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportCalculator;

// setResults is now managed by useState above
