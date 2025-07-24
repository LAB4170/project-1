import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Calculator, Users, Settings, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Enhanced car slides with 3D-like presentation data
  const carSlides = [
    {
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      brand: 'Toyota',
      model: 'Land Cruiser',
      description: 'Unmatched Reliability & Power',
      price: 'From KSh 4.2M',
      features: ['4WD System', 'V8 Engine', 'Premium Interior'],
      gradient: 'from-blue-900/90 via-blue-800/70 to-blue-900/90'
    },
    {
      image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      brand: 'Mercedes-Benz',
      model: 'E-Class',
      description: 'Luxury Redefined',
      price: 'From KSh 6.8M',
      features: ['AMG Package', 'Premium Sound', 'Advanced Safety'],
      gradient: 'from-slate-900/90 via-slate-800/70 to-slate-900/90'
    },
    {
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      brand: 'BMW',
      model: 'X5',
      description: 'Ultimate Driving Machine',
      price: 'From KSh 5.5M',
      features: ['xDrive AWD', 'Sport Package', 'iDrive System'],
      gradient: 'from-gray-900/90 via-gray-800/70 to-gray-900/90'
    },
    {
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      brand: 'Nissan',
      model: 'X-Trail',
      description: 'Adventure Awaits',
      price: 'From KSh 3.2M',
      features: ['CVT Transmission', 'All-Mode 4x4', 'Intelligent Mobility'],
      gradient: 'from-red-900/90 via-red-800/70 to-red-900/90'
    },
    {
      image: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      brand: 'Honda',
      model: 'CR-V',
      description: 'Efficiency Meets Comfort',
      price: 'From KSh 3.8M',
      features: ['VTEC Engine', 'Honda Sensing', 'Spacious Interior'],
      gradient: 'from-green-900/90 via-green-800/70 to-green-900/90'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carSlides.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, carSlides.length]);

  const scrollToInventory = () => {
    const element = document.getElementById('inventory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const element = document.getElementById('calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carSlides.length) % carSlides.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const currentCar = carSlides[currentSlide];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced 3D-like Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {carSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 transform ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : index === (currentSlide - 1 + carSlides.length) % carSlides.length
                ? 'opacity-30 scale-110 -translate-x-full'
                : index === (currentSlide + 1) % carSlides.length
                ? 'opacity-30 scale-110 translate-x-full'
                : 'opacity-0 scale-95'
            }`}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1000"
              style={{ 
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1.1)',
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
            
            {/* Floating Elements for 3D Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-32 right-16 w-24 h-24 bg-amber-500/10 rounded-full blur-lg animate-bounce"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-md animate-pulse delay-1000"></div>
            </div>
          </div>
        ))}
        
        {/* Enhanced Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Auto-play Control */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-xl border border-white/20"
        >
          {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {carSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-amber-500 shadow-lg' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Content with 3D Effects */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Animated Car Showcase Card */}
          <div className={`mb-12 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <div className="text-6xl font-bold text-amber-400 animate-pulse">
                  {currentCar.brand.charAt(0)}
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-amber-400 mb-2">
                    {currentCar.brand} {currentCar.model}
                  </h3>
                  <p className="text-xl text-gray-200 mb-2">
                    {currentCar.description}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {currentCar.price}
                  </p>
                </div>
              </div>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                {currentCar.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Heading with Animation */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight transform transition-all duration-1000 delay-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Import Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 animate-pulse">
              Dream Car
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 text-gray-200 leading-relaxed max-w-4xl mx-auto transform transition-all duration-1000 delay-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            From Japan, UK & UAE with complete transparency and expert guidance.
            <br />
            <span className="text-amber-400 font-semibold">Live tracking • Real-time pricing • Guaranteed quality</span>
          </p>

          {/* Enhanced Search Bar */}
          <div className={`max-w-3xl mx-auto mb-12 transform transition-all duration-1000 delay-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 flex items-center border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <input
                type="text"
                placeholder="Search Toyota Prado, BMW X5, Mercedes E-Class..."
                className="flex-1 bg-transparent text-white placeholder-gray-300 px-6 py-4 focus:outline-none text-lg"
              />
              <button 
                onClick={scrollToInventory}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className={`flex flex-col md:flex-row gap-6 justify-center mb-16 transform transition-all duration-1000 delay-900 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button 
              onClick={scrollToInventory}
              className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center justify-center space-x-3 border border-amber-400/30"
            >
              <span>Browse Live Inventory</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button 
              onClick={scrollToCalculator}
              className="group border-2 border-white/30 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-lg flex items-center justify-center space-x-3 hover:border-white/50 hover:scale-105 shadow-xl"
            >
              <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Calculate Import Costs</span>
            </button>
          </div>

          {/* Enhanced Stats with Animation */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transform transition-all duration-1000 delay-1100 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {[
              { number: '500+', label: 'Cars Imported', icon: '🚗' },
              { number: '15+', label: 'Years Experience', icon: '⭐' },
              { number: '98%', label: 'Client Satisfaction', icon: '❤️' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-xl">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-amber-400 mb-2 group-hover:text-amber-300 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-4 bg-white/70 rounded-full mt-3 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-30 flex flex-col space-y-4">
        <button
          onClick={scrollToCalculator}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-blue-400/30"
          title="Quick Calculator"
        >
          <Calculator className="w-6 h-6" />
        </button>
        <button
          onClick={() => window.open('https://wa.me/254700123456', '_blank')}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-green-400/30"
          title="WhatsApp Us"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;