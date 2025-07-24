import React, { useState } from 'react';
import { X, Star, Send, CheckCircle } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    id: string;
  };
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, vehicleInfo }) => {
  const { addReview } = useReviews();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    service_type: 'import-service',
    overall_rating: 0,
    service_quality: 0,
    communication: 0,
    value_for_money: 0,
    delivery_time: 0,
    review_text: '',
    would_recommend: true,
  });

  const serviceTypes = [
    { value: 'import-service', label: 'Car Import Service' },
    { value: 'consultation', label: 'Consultation Service' },
    { value: 'documentation', label: 'Documentation Support' },
    { value: 'shipping', label: 'Shipping & Logistics' },
    { value: 'after-sales', label: 'After Sales Support' },
  ];

  const ratingCategories = [
    { key: 'overall_rating', label: 'Overall Experience', icon: '⭐' },
    { key: 'service_quality', label: 'Service Quality', icon: '🎯' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'value_for_money', label: 'Value for Money', icon: '💰' },
    { key: 'delivery_time', label: 'Delivery Time', icon: '⏰' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all ratings are provided
    const ratings = [
      formData.overall_rating,
      formData.service_quality,
      formData.communication,
      formData.value_for_money,
      formData.delivery_time
    ];
    
    if (ratings.some(rating => rating === 0)) {
      toast.error('Please provide ratings for all categories');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        ...formData,
        vehicle_id: vehicleInfo?.id || null,
      };

      await addReview(reviewData);
      
      setIsSubmitted(true);
      toast.success('Thank you for your review! It will be published after approval.');
      
      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          customer_name: '',
          customer_email: '',
          service_type: 'import-service',
          overall_rating: 0,
          service_quality: 0,
          communication: 0,
          value_for_money: 0,
          delivery_time: 0,
          review_text: '',
          would_recommend: true,
        });
        onClose();
      }, 3000);
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (category: string, value: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, [category]: star }))}
            className={`w-8 h-8 transition-colors ${
              star <= value
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className={`w-full h-full ${star <= value ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Share Your Experience</h2>
              {vehicleInfo && (
                <p className="text-gray-600 mt-1">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Thank You for Your Review! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                Your feedback is valuable to us and will help other customers make informed decisions.
              </p>
              <p className="text-sm text-gray-500">
                Your review will be published after our team reviews it.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Received *
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Categories */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Rate Your Experience</h3>
                {ratingCategories.map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <label className="font-medium text-gray-900">
                          {category.label}
                        </label>
                        <p className="text-sm text-gray-600">
                          {formData[category.key as keyof typeof formData] === 0 
                            ? 'Click to rate' 
                            : `${formData[category.key as keyof typeof formData]} star${formData[category.key as keyof typeof formData] !== 1 ? 's' : ''}`
                          }
                        </p>
                      </div>
                    </div>
                    {renderStarRating(category.key, formData[category.key as keyof typeof formData] as number)}
                  </div>
                ))}
              </div>

              {/* Written Review */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your experience *
                </label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Share details about your experience with our service..."
                  required
                />
              </div>

              {/* Recommendation */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="recommend"
                  checked={formData.would_recommend}
                  onChange={(e) => setFormData(prev => ({ ...prev, would_recommend: e.target.checked }))}
                  className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="recommend" className="text-sm font-medium text-gray-700">
                  I would recommend WillPhil Motors to others
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;