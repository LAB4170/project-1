import React, { useState } from 'react';
import { Plus, Upload, Car, Tag, Settings, X, Save, Trash2, BarChart3, TrendingUp } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useDeals } from '../hooks/useDeals';
import Dashboard from './Dashboard';
import MarketIntelligence from './MarketIntelligence';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { deals, addDeal } = useDeals();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vehicles' | 'deals' | 'intelligence'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);

  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    image_url: '',
    gallery_images: [''],
    mileage: '',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    location: 'Japan',
    features: [''],
    kenya_ready: false,
    rhd: true,
    body_type: 'SUV',
    engine_size: '',
    condition: 'Excellent',
    description: '',
    status: 'available' as const,
  });

  const [dealForm, setDealForm] = useState({
    title: '',
    description: '',
    discount_percentage: 0,
    valid_until: '',
    image_url: '',
  });

  const resetVehicleForm = () => {
    setVehicleForm({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      image_url: '',
      gallery_images: [''],
      mileage: '',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      location: 'Japan',
      features: [''],
      kenya_ready: false,
      rhd: true,
      body_type: 'SUV',
      engine_size: '',
      condition: 'Excellent',
      description: '',
      status: 'available' as const,
    });
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vehicleData = {
        ...vehicleForm,
        gallery_images: vehicleForm.gallery_images.filter(img => img.trim()),
        features: vehicleForm.features.filter(feature => feature.trim()),
      };

      await addVehicle(vehicleData);
      toast.success('Vehicle added successfully!');
      resetVehicleForm();
      setShowAddForm(false);
    } catch (error) {
      toast.error('Failed to add vehicle');
      console.error(error);
    }
  };

  const handleUpdateVehicle = async (vehicleId: string) => {
    try {
      const vehicleData = {
        ...vehicleForm,
        gallery_images: vehicleForm.gallery_images.filter(img => img.trim()),
        features: vehicleForm.features.filter(feature => feature.trim()),
      };

      await updateVehicle(vehicleId, vehicleData);
      toast.success('Vehicle updated successfully!');
      setEditingVehicle(null);
      resetVehicleForm();
    } catch (error) {
      toast.error('Failed to update vehicle');
      console.error(error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId);
        toast.success('Vehicle deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete vehicle');
        console.error(error);
      }
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDeal(dealForm);
      toast.success('Deal added successfully!');
      setDealForm({
        title: '',
        description: '',
        discount_percentage: 0,
        valid_until: '',
        image_url: '',
      });
    } catch (error) {
      toast.error('Failed to add deal');
      console.error(error);
    }
  };

  const startEditing = (vehicle: any) => {
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      image_url: vehicle.image_url,
      gallery_images: vehicle.gallery_images.length ? vehicle.gallery_images : [''],
      mileage: vehicle.mileage,
      fuel_type: vehicle.fuel_type,
      transmission: vehicle.transmission,
      location: vehicle.location,
      features: vehicle.features.length ? vehicle.features : [''],
      kenya_ready: vehicle.kenya_ready,
      rhd: vehicle.rhd,
      body_type: vehicle.body_type,
      engine_size: vehicle.engine_size,
      condition: vehicle.condition,
      description: vehicle.description,
      status: vehicle.status,
    });
    setEditingVehicle(vehicle.id);
  };

  const addImageField = () => {
    setVehicleForm(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setVehicleForm(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const addFeatureField = () => {
    setVehicleForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index: number) => {
    setVehicleForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'vehicles'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Car className="w-5 h-5 inline mr-2" />
                Vehicles
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'deals'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Tag className="w-5 h-5 inline mr-2" />
                Deals
              </button>
              <button
                onClick={() => setActiveTab('intelligence')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'intelligence'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Market Intel
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}

        {/* Market Intelligence Tab */}
        {activeTab === 'intelligence' && (
          <MarketIntelligence />
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div>
            {/* Add Vehicle Button */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Arrival</span>
                </button>
                <div className="text-sm text-gray-600">
                  Total Vehicles: <span className="font-semibold">{vehicles.length}</span>
                </div>
              </div>
            </div>

            {/* Vehicle List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-900">Vehicle Inventory ({vehicles.length})</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={vehicle.image_url}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-16 h-16 rounded-lg object-cover mr-4"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">{vehicle.body_type} • {vehicle.fuel_type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          KSh {(vehicle.price / 1000000).toFixed(1)}M
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                            vehicle.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => startEditing(vehicle)}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div>
            {/* Add Deal Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Deal</h2>
              <form onSubmit={handleAddDeal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title</label>
                  <input
                    type="text"
                    value={dealForm.title}
                    onChange={(e) => setDealForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
                  <input
                    type="number"
                    value={dealForm.discount_percentage}
                    onChange={(e) => setDealForm(prev => ({ ...prev, discount_percentage: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                  <input
                    type="datetime-local"
                    value={dealForm.valid_until}
                    onChange={(e) => setDealForm(prev => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={dealForm.image_url}
                    onChange={(e) => setDealForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={dealForm.description}
                    onChange={(e) => setDealForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Add Deal
                  </button>
                </div>
              </form>
            </div>

            {/* Active Deals */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Active Deals ({deals.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal) => (
                  <div key={deal.id} className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{deal.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {deal.discount_percentage}% OFF
                      </span>
                      <span className="text-xs text-gray-500">
                        Until {new Date(deal.valid_until).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Vehicle Modal */}
        {(showAddForm || editingVehicle) && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingVehicle(null);
                      resetVehicleForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={vehicleForm.status}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, status: e.target.value as 'available' | 'sold' | 'reserved' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingVehicle) {
                      handleUpdateVehicle(editingVehicle);
                    } else {
                      handleAddVehicle(e);
                    }
                  }}
                  className="space-y-6"
                >
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                      <input
                        type="text"
                        value={vehicleForm.make}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, make: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                      <input
                        type="text"
                        value={vehicleForm.model}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="number"
                        value={vehicleForm.year}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, year: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Price and Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (KSh)</label>
                      <input
                        type="number"
                        value={vehicleForm.price}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                      <input
                        type="text"
                        value={vehicleForm.mileage}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, mileage: e.target.value }))}
                        placeholder="e.g., 45,000 km"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                      <select
                        value={vehicleForm.fuel_type}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, fuel_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                      <select
                        value={vehicleForm.transmission}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, transmission: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="CVT">CVT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select
                        value={vehicleForm.location}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Japan">Japan</option>
                        <option value="UK">UK</option>
                        <option value="UAE">UAE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                      <select
                        value={vehicleForm.body_type}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, body_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Wagon">Station Wagon</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Pickup">Pickup</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                      <input
                        type="text"
                        value={vehicleForm.engine_size}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, engine_size: e.target.value }))}
                        placeholder="e.g., 2.0L, 3000cc"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                      <select
                        value={vehicleForm.condition}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, condition: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={vehicleForm.kenya_ready}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, kenya_ready: e.target.checked }))}
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Kenya Ready</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={vehicleForm.rhd}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, rhd: e.target.checked }))}
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Right Hand Drive</span>
                    </label>
                  </div>

                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
                    <input
                      type="url"
                      value={vehicleForm.image_url}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                      <button
                        type="button"
                        onClick={addImageField}
                        className="text-amber-500 hover:text-amber-600 text-sm font-medium"
                      >
                        + Add Image
                      </button>
                    </div>
                    {vehicleForm.gallery_images.map((image, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => {
                            const newImages = [...vehicleForm.gallery_images];
                            newImages[index] = e.target.value;
                            setVehicleForm(prev => ({ ...prev, gallery_images: newImages }));
                          }}
                          placeholder="Image URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {vehicleForm.gallery_images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <button
                        type="button"
                        onClick={addFeatureField}
                        className="text-amber-500 hover:text-amber-600 text-sm font-medium"
                      >
                        + Add Feature
                      </button>
                    </div>
                    {vehicleForm.features.map((feature, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...vehicleForm.features];
                            newFeatures[index] = e.target.value;
                            setVehicleForm(prev => ({ ...prev, features: newFeatures }));
                          }}
                          placeholder="Feature name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {vehicleForm.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeatureField(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={vehicleForm.description}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Detailed description of the vehicle..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingVehicle(null);
                        resetVehicleForm();
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;