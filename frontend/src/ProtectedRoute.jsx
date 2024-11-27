import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import api from './api';
import { setLogout } from './state';
import Preloader from './Preloader';

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuth(false);
                return;
            }

            try {
                const response = await api.get('/api/user/check-token-validity', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsAuth(response.data?.user);
            } catch (error) {
                dispatch(setLogout());
                setIsAuth(false);
            }
        };

        validateToken();
    }, [token, dispatch]);

    if (isAuth === null) {
        return <Preloader />;
    }

    const { pathname } = location;
    const childType = children.type?.componentName;
    const isAuthPage = ['Signin', 'Signup', 'ForgotPassword', 'AdminLogin'].includes(childType);

    if (isAuthPage && isAuth) {
        const redirectPath = isAuth.role === 'Admin' ? '/bookings' : '/';
        return <Navigate to={redirectPath} />;
    }

    if (!isAuth && !isAuthPage) {
        if (['/change-password', '/dashboard'].includes(pathname)) {
            return <Navigate to="/sign-in" />;
        } else if (pathname.startsWith('/admin-dashboard') || pathname.startsWith('/reservation') || pathname.startsWith('/bookings') || pathname.startsWith('/users') || pathname.startsWith('/customers') || pathname.startsWith('/vendors') || pathname.startsWith('/airports') || pathname.startsWith('/vendors/bookings/') || pathname.startsWith('/extras')) {
            return <Navigate to="/admin-login" />;
        }
    }

    const isUser = isAuth?.role === 'User';
    const isAdmin = isAuth?.role === 'Admin';
    const isModerator = isAuth?.role === 'Moderator';
    const isAdminUser = isAuth?.role === 'Admin-User';
    const adminRoutes = ['/admin-login', '/admin-dashboard', '/reservation', '/bookings', '/users', '/customers', '/vendors', '/airports', '/vendors/bookings/:id'];
    const userRoutes = ['/', '/about-us', '/sign-in', '/sign-up', '/forgot-password', '/privacy-policy', '/terms-and-conditions', '/faq', '/contact-us', '/services', '/results', '/booking', '/dashboard', '/change-password'];

    if ((isAdminUser || isModerator) && ['/vendors', '/airports', '/users'].includes(pathname)) {
        return <Navigate to="/bookings" />;
    };
    
    if (isUser && (adminRoutes.includes(pathname) || pathname.startsWith('/vendors/bookings/'))) {
        return <Navigate to="/" />;
    };

    if ((isAdmin || isModerator || isAdminUser) && userRoutes.includes(pathname)) {
        return <Navigate to="/bookings" />;
    };

    if (childType === 'VendorList') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return children;
};

export default ProtectedRoute;
