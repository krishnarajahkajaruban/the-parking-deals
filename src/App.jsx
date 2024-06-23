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

import AOS from 'aos';
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/bootstrap4-light-purple/theme.css";

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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/faq' element={<FaQ />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/services' element={<Services />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
