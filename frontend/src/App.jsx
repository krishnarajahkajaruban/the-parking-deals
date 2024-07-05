import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import FaQ from './pages/FaQ/FaQ';
import ContactUs from './pages/ContactUs/ContactUs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Services from './pages/Services/Services';
import VendorList from './pages/VendorList/VendorList';
import Booking from './pages/Booking/Booking';
import Dashboard from './pages/Dashboard/Dashboard';

import Preloader from './Preloader';

import AOS from 'aos';
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import ProtectedRoute from './ProtectedRoute';

function App() {
  const value = {
    ripple: true,
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }, []);

  return (
    <PrimeReactProvider value={value}>
      <Preloader />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/sign-in' element={<ProtectedRoute><Signin /></ProtectedRoute>} />
        <Route path='/sign-up' element={<ProtectedRoute><Signup /></ProtectedRoute>} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/faq' element={<FaQ />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
        <Route path='/services' element={<Services />} />
        <Route path='/results' element={<VendorList />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
