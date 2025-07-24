import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Car,
  Calculator,
  Users,
  CheckCircle
} from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'import-consultation',
    budget: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+254 700 123 456', '+254 720 987 654'],
      action: 'Call us now'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['info@willphilmotors.co.ke', 'sales@willphilmotors.co.ke'],
      action: 'Send an email'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Office',
      details: ['Westlands, Nairobi', 'Mombasa Road, Nairobi'],
      action: 'Visit our office'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Working Hours',
      details: ['Mon - Fri: 8AM - 6PM', 'Saturday: 9AM - 4PM'],
      action: '24/7 WhatsApp support'
    }
  ];

  const services = [
    { value: 'import-consultation', label: 'Import Consultation' },
    { value: 'vehicle-sourcing', label: 'Vehicle Sourcing' },
    { value: 'cost-calculation', label: 'Cost Calculation' },
    { value: 'shipping-logistics', label: 'Shipping & Logistics' },
    { value: 'documentation', label: 'Documentation Support' },
    { value: 'after-sales', label: 'After Sales Support' }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get In
            <span className="text-amber-500"> Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to import your dream car? Our expert team is here to guide you 
            through every step of the process. Get in touch today for a free consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-amber-500 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Send us a Message</h3>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Message Sent Successfully!
                </h4>
                <p className="text-gray-600">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Budget Range (KSh)
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                      placeholder="e.g., 2M - 5M"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Service Interested In *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                  >
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 resize-none"
                    placeholder="Tell us about your requirements, preferred car model, or any specific questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-amber-500 p-3 rounded-lg text-white flex-shrink-0">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-2">
                          {info.title}
                        </h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 mb-1">
                            {detail}
                          </p>
                        ))}
                        <p className="text-amber-600 font-semibold text-sm mt-2">
                          {info.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-6">Quick Actions</h4>
              
              <div className="space-y-4">
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-3">
                  <Car className="w-5 h-5" />
                  <span>Browse Inventory</span>
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-3">
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Import Costs</span>
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Book Consultation</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-gray-300 text-sm mb-4">
                  Follow us for the latest arrivals and updates:
                </p>
                <div className="flex space-x-4">
                  {['Facebook', 'Instagram', 'WhatsApp', 'YouTube'].map((platform) => (
                    <button
                      key={platform}
                      className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-gray-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Visit Our Showroom
          </h3>
          <p className="text-gray-600 mb-6">
            Come see our latest arrivals and speak with our experts in person.
          </p>
          <div className="bg-amber-100 rounded-xl p-8">
            <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Westlands Office
            </h4>
            <p className="text-gray-600">
              ABC Plaza, 4th Floor, Waiyaki Way<br />
              Westlands, Nairobi, Kenya
            </p>
            <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;