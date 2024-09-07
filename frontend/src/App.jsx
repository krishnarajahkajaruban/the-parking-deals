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


/* For admin panel */
import AdminLogin from './admin/AdminLogin/AdminLogin';
import Layout from './admin/AdminLayout/Layout';
// import AdminDashboard from './admin/AdminDashboard/AdminDashboard';
// import Reservation from './admin/Reservation/Reservation';
// import Bookings from './admin/Bookings/Bookings';
// import Users from './admin/Users/Users';
// import Customers from './admin/Customers/Customers';
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

/* For admin panel */
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard/AdminDashboard'));
const Reservation = React.lazy(() => import('./admin/Reservation/Reservation'));
const Bookings = React.lazy(() => import('./admin/Bookings/Bookings'));
const Users = React.lazy(() => import('./admin/Users/Users'));
const Customers = React.lazy(() => import('./admin/Customers/Customers'));
const Vendors = React.lazy(() => import('./admin/Vendors/Vendors'));
const VendorsBookings = React.lazy(() => import('./admin/Vendors/VendorBookings'));
const Extras = React.lazy(() => import('./admin/Extras/Extras'));


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
        <Route path='/' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Home /></ProtectedRoute></Suspense>} />
        <Route path='/about-us' element={<Suspense fallback={<Preloader />}><ProtectedRoute><AboutUs /></ProtectedRoute></Suspense>} />
        <Route path='/sign-in' element={<ProtectedRoute><Signin /></ProtectedRoute>} />
        <Route path='/sign-up' element={<ProtectedRoute><Signup /></ProtectedRoute>} />
        <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
        <Route path='/privacy-policy' element={<Suspense fallback={<Preloader />}><ProtectedRoute><PrivacyPolicy /></ProtectedRoute></Suspense>} />
        <Route path='/terms-and-conditions' element={<Suspense fallback={<Preloader />}><ProtectedRoute><TermsAndConditions /></ProtectedRoute></Suspense>} />
        <Route path='/faq' element={<Suspense fallback={<Preloader />}><ProtectedRoute><FaQ /></ProtectedRoute></Suspense>} />
        <Route path='/contact-us' element={<Suspense fallback={<Preloader />}><ProtectedRoute><ContactUs /></ProtectedRoute></Suspense>} />
        <Route path='/services' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Services /></ProtectedRoute></Suspense>} />
        <Route path='/results' element={<ProtectedRoute><VendorList /></ProtectedRoute>} />
        <Route path='/booking' element={<Suspense fallback={<Preloader />}><Booking /></Suspense>} />
        <Route path='/dashboard' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Dashboard /></ProtectedRoute></Suspense>} />
        <Route path='/change-password' element={<Suspense fallback={<Preloader />}><ProtectedRoute><ChangePassword /></ProtectedRoute></Suspense>} />

        {/* Admin routes */}
        <Route path='/admin-login' element={<ProtectedRoute><AdminLogin /></ProtectedRoute>} />
        <Route path="/" element={<Layout />}>
          <Route path='admin-dashboard' element={<Suspense fallback={<Preloader />}><ProtectedRoute><AdminDashboard /></ProtectedRoute></Suspense>} />
          <Route path='reservation' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Reservation /></ProtectedRoute></Suspense>} />
          <Route path='bookings' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Bookings /></ProtectedRoute></Suspense>} />
          <Route path='users' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Users /></ProtectedRoute></Suspense>} />
          <Route path='customers' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Customers /></ProtectedRoute></Suspense>} />
          <Route path='vendors' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Vendors /></ProtectedRoute></Suspense>} />
          <Route path='vendors/bookings/:id' element={<Suspense fallback={<Preloader />}><ProtectedRoute><VendorsBookings /></ProtectedRoute></Suspense>} />
          <Route path='extras' element={<Suspense fallback={<Preloader />}><ProtectedRoute><Extras /></ProtectedRoute></Suspense>} />
        </Route>
        {/*  */}
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
