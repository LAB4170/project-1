import React from 'react';
import { 
  Truck, 
  FileCheck, 
  Shield, 
  Users, 
  MapPin, 
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Vehicle Sourcing',
      description: 'Access to premium vehicles from Japan, UK, and UAE with verified history and condition reports.',
      features: ['Auction Access', 'Inspection Reports', 'Multiple Options', 'Quality Guarantee'],
      color: 'bg-blue-500',
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Import Documentation',
      description: 'Complete handling of all paperwork, permits, and legal requirements for hassle-free importation.',
      features: ['KRA Compliance', 'NTSA Registration', 'Insurance Setup', 'Transfer Services'],
      color: 'bg-green-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Shipping & Logistics',
      description: 'Secure shipping with insurance coverage and real-time tracking from origin to Mombasa port.',
      features: ['Insured Shipping', 'Live Tracking', 'Port Clearing', 'Safe Delivery'],
      color: 'bg-purple-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Consultation',
      description: '1-on-1 guidance from our experienced team to help you make informed decisions.',
      features: ['Market Analysis', 'Best Value Cars', 'Financing Options', 'Ongoing Support'],
      color: 'bg-amber-500',
    },
  ];

  const process = [
    {
      step: 1,
      title: 'Consultation',
      description: 'We discuss your requirements, budget, and preferences to find the perfect match.',
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: 2,
      title: 'Vehicle Selection',
      description: 'Browse our curated inventory or let us source specific vehicles from our network.',
      icon: <Star className="w-6 h-6" />,
    },
    {
      step: 3,
      title: 'Documentation',
      description: 'We handle all paperwork, permits, and legal requirements for smooth processing.',
      icon: <FileCheck className="w-6 h-6" />,
    },
    {
      step: 4,
      title: 'Shipping',
      description: 'Secure shipping with insurance and real-time tracking to Mombasa port.',
      icon: <Truck className="w-6 h-6" />,
    },
    {
      step: 5,
      title: 'Clearing',
      description: 'Professional port clearing, inspection, and customs duty payment.',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      step: 6,
      title: 'Delivery',
      description: 'Final inspection and delivery of your dream car to your preferred location.',
      icon: <MapPin className="w-6 h-6" />,
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Our Premium
            <span className="text-amber-500"> Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            End-to-end car importation services with complete transparency, 
            expert guidance, and guaranteed satisfaction.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`${service.color} p-4 rounded-xl w-fit mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Import Process
            </h3>
            <p className="text-xl text-gray-300">
              Simple, transparent, and efficient - from selection to delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                
                <div className="flex items-center space-x-4 mb-4 mt-4">
                  <div className="bg-amber-500 p-3 rounded-lg text-white">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {step.title}
                  </h4>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
              Start Your Import Journey
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose WillPhil Motors?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">15+ Years</h4>
              <p className="text-gray-600">Industry Experience</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">100%</h4>
              <p className="text-gray-600">Legal Compliance</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-12 h-12 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">98%</h4>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Truck className="w-12 h-12 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">500+</h4>
              <p className="text-gray-600">Cars Imported</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;