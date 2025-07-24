import React, { useState } from 'react';
import { X, Send, Car, Calculator, Phone, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, vehicleId, vehicleInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: vehicleId ? 'vehicle-inquiry' : 'import-consultation',
    budget: '',
    message: vehicleId && vehicleInfo 
      ? `I'm interested in the ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}. Please provide more details about pricing, condition, and import process.`
      : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { value: 'vehicle-inquiry', label: 'Vehicle Inquiry' },
    { value: 'import-consultation', label: 'Import Consultation' },
    { value: 'cost-calculation', label: 'Cost Calculation' },
    { value: 'financing-options', label: 'Financing Options' },
    { value: 'shipping-logistics', label: 'Shipping & Logistics' },
    { value: 'documentation', label: 'Documentation Support' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        ...formData,
        vehicle_id: vehicleId || null,
        status: 'new' as const,
      };

      const { error } = await supabase
        .from('inquiries')
        .insert([inquiryData]);

      if (error) throw error;

      toast.success('Inquiry submitted successfully! We\'ll contact you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'import-consultation',
        budget: '',
        message: '',
      });
      
      onClose();
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickContact = () => {
    const message = vehicleId && vehicleInfo
      ? `Hi, I'm interested in the ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} (ID: ${vehicleId}). Can you provide more details?`
      : 'Hi, I\'m interested in your car importation services. Can you provide more information?';
    
    const whatsappUrl = `https://wa.me/254700123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {vehicleId ? 'Vehicle Inquiry' : 'Get in Touch'}
              </h2>
              {vehicleInfo && (
                <p className="text-gray-600 mt-1">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} - KSh {(vehicleInfo.price / 1000000).toFixed(1)}M
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

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleQuickContact}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>WhatsApp Now</span>
            </button>
            <a
              href="tel:+254700123456"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Direct</span>
            </a>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Or Send Detailed Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="e.g., 2M - 5M"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Needed *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Please provide details about your requirements, preferred timeline, or any specific questions..."
                  required
                />
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
                  <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>info@willphilmotors.co.ke</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              We typically respond within 2-4 hours during business hours (8AM - 6PM, Mon-Fri)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;