import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import VehicleShowcase from './components/VehicleShowcase';
import LiveDeals from './components/LiveDeals';
import ImportCalculator from './components/ImportCalculator';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import ChatWidget from './components/ChatWidget';

function App() {
  // Check if we're on the admin route
  const isAdminRoute = window.location.pathname === '/admin';

  if (isAdminRoute) {
    return (
      <>
        <AdminPanel />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <VehicleShowcase />
        <LiveDeals />
        <ImportCalculator />
        <Services />
        <Testimonials />
        <Contact />
        <Footer />
        <ChatWidget />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;