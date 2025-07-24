import React, { useState } from 'react';
import { Heart, Eye, Calendar, Fuel, Settings, MapPin, Phone, Mail, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string;
  gallery_images: string[];
  mileage: string;
  fuel_type: string;
  transmission: string;
  location: string;
  features: string[];
  kenya_ready: boolean;
  rhd: boolean;
  body_type: string;
  engine_size: string;
  condition: string;
  description: string;
  status: 'available' | 'sold' | 'reserved';
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onInquire: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onInquire }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return `KSh ${(price / 1000000).toFixed(1)}M`;
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleInquire = () => {
    onInquire(vehicle.id);
    toast.success('Inquiry form opened');
  };

  const handleQuickContact = () => {
    const message = `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id}). Can you provide more details?`;
    const whatsappUrl = `https://wa.me/254700123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const allImages = [vehicle.image_url, ...vehicle.gallery_images];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
            }}
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              vehicle.status === 'available' ? 'bg-green-500 text-white' :
              vehicle.status === 'reserved' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-4 right-4 space-y-2">
            {vehicle.kenya_ready && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold block">
                Kenya Ready ✅
              </span>
            )}
            {vehicle.rhd && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold block">
                RHD
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setShowQuickView(true)}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
              {formatPrice(vehicle.price)}
            </span>
          </div>

          {/* Gallery Indicator */}
          {vehicle.gallery_images.length > 0 && (
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              +{vehicle.gallery_images.length} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{vehicle.location}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{vehicle.mileage}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4" />
              <span>{vehicle.fuel_type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {vehicle.engine_size}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {vehicle.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="text-amber-500 text-sm font-semibold">
                  +{vehicle.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Condition & Body Type */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
              {vehicle.condition}
            </span>
            <span className="text-gray-600">{vehicle.body_type}</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={handleInquire}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Get Quote
              </button>
              <button
                onClick={() => setShowQuickView(true)}
                className="flex-1 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white py-3 rounded-lg font-semibold transition-all duration-200"
              >
                View Details
              </button>
            </div>
            
            <button
              onClick={handleQuickContact}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                  <div className="relative mb-4">
                    <img
                      src={allImages[currentImageIndex]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-80 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                      }}
                    />
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index ? 'border-amber-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`View ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-amber-500 mb-2">
                      {formatPrice(vehicle.price)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.location}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-semibold ml-2">{vehicle.mileage}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fuel:</span>
                      <span className="font-semibold ml-2">{vehicle.fuel_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Transmission:</span>
                      <span className="font-semibold ml-2">{vehicle.transmission}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Engine:</span>
                      <span className="font-semibold ml-2">{vehicle.engine_size}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Body Type:</span>
                      <span className="font-semibold ml-2">{vehicle.body_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <span className="font-semibold ml-2">{vehicle.condition}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {vehicle.description && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                      <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleInquire}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Request Detailed Quote
                    </button>
                    <button
                      onClick={handleQuickContact}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>WhatsApp Direct Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleCard;