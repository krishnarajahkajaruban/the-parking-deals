import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
// import Home from './pages/Home/Home';
// import AboutUs from './pages/AboutUs/AboutUs';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
// import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
// import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
// import FaQ from './pages/FaQ/FaQ';
// import ContactUs from './pages/ContactUs/ContactUs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
// import Services from './pages/Services/Services';
import VendorList from './pages/VendorList/VendorList';
// import Booking from './pages/Booking/Booking';
// import Dashboard from './pages/Dashboard/Dashboard';
// import ChangePassword from './pages/ChangePassword/ChangePassword';

import Preloader from './Preloader';

import AOS from 'aos';
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import ProtectedRoute from './ProtectedRoute';


/* For admin dashboard */
import AdminLogin from './admin/AdminLogin/AdminLogin';
/*  */

const Home = React.lazy(() => import('./pages/Home/Home'));
const AboutUs = React.lazy(() => import('./pages/AboutUs/AboutUs'));
// const Signin = React.lazy(()=>import('./pages/Signin/ModifiedSigin'));
// const Signup = React.lazy(()=>import('./pages/Signup/Signup'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions/TermsAndConditions'));
const FaQ = React.lazy(() => import('./pages/FaQ/FaQ'));
const ContactUs = React.lazy(() => import('./pages/ContactUs/ContactUs'));
// const ForgotPassword = React.lazy(()=>import('./pages/ForgotPassword/ForgotPassword'));
const Services = React.lazy(() => import('./pages/Services/Services'));
// const VendorList = React.lazy(()=>import('./pages/VendorList/VendorList'));
const Booking = React.lazy(() => import('./pages/Booking/Booking'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const ChangePassword = React.lazy(() => import('./pages/ChangePassword/ChangePassword'));

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
      {/* <Preloader /> */}
      {/* <Suspense fallback={<Preloader />}>
            <Routes>
                <Route path='/sign-in' element={<ProtectedRoute><Signin /></ProtectedRoute>} />
                <Route path='/sign-up' element={<ProtectedRoute><Signup /></ProtectedRoute>} />
                <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
            </Routes>
        </Suspense> */}
      <Routes>
        <Route path='/' element={<Suspense fallback={<Preloader />}><Home /></Suspense>} />
        <Route path='/about-us' element={<Suspense fallback={<Preloader />}><AboutUs /></Suspense>} />
        <Route path='/sign-in' element={<ProtectedRoute><Signin /></ProtectedRoute>} />
        <Route path='/sign-up' element={<ProtectedRoute><Signup /></ProtectedRoute>} />
        <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
        <Route path='/privacy-policy' element={<Suspense fallback={<Preloader />}><PrivacyPolicy /></Suspense>} />
        <Route path='/terms-and-conditions' element={<Suspense fallback={<Preloader />}><TermsAndConditions /></Suspense>} />
        <Route path='/faq' element={<Suspense fallback={<Preloader />}><FaQ /></Suspense>} />
        <Route path='/contact-us' element={<Suspense fallback={<Preloader />}><ContactUs /></Suspense>} />
        <Route path='/services' element={<Suspense fallback={<Preloader />}><Services /></Suspense>} />
        <Route path='/results' element={<ProtectedRoute><VendorList /></ProtectedRoute>} />
        <Route path='/booking' element={<Suspense fallback={<Preloader />}><Booking /></Suspense>} />
        <Route path='/dashboard' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Dashboard /></ProtectedRoute></Suspense>} />
        <Route path='/change-password' element={<Suspense fallback={<Preloader />}><ProtectedRoute><ChangePassword /></ProtectedRoute></Suspense>} />

        {/* Admin routes */}
        <Route path='/admin-login' element={<Suspense fallback={<Preloader />}><AdminLogin /></Suspense>} />
        {/*  */}
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
