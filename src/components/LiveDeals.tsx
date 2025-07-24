import React from 'react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { useDeals } from '../hooks/useDeals';

const LiveDeals: React.FC = () => {
  const { deals, loading } = useDeals();

  if (loading || deals.length === 0) return null;

  const formatTimeRemaining = (validUntil: string) => {
    const now = new Date();
    const endDate = new Date(validUntil);
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Tag className="w-8 h-8 text-yellow-300" />
            <h2 className="text-4xl md:text-5xl font-bold">
              🔥 Live Deals
            </h2>
          </div>
          <p className="text-xl text-red-100">
            Limited time offers on premium vehicles - Don't miss out!
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
            >
              {/* Deal Image */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                  }}
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-400 text-red-600 px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    {deal.discount_percentage}% OFF
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/70 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {formatTimeRemaining(deal.valid_until)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deal Content */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">{deal.title}</h3>
                <p className="text-red-100 leading-relaxed">{deal.description}</p>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-600 py-3 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                <span>Claim This Deal</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-red-100 mb-4 text-lg">
            New deals added weekly! Subscribe to never miss an offer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 hover:bg-yellow-300 text-red-600 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDeals;