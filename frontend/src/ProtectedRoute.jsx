import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import api from './api';
import { setLogout } from './state';
import Preloader from './Preloader';

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuth(false);
                return;
            }

            try {
                const response = await api.get('/api/user/check-token-validity', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setIsAuth(true);
            } catch (error) {
                dispatch(setLogout()); // Remove invalid token from the store
                setIsAuth(false);
            }
        };

        validateToken();
    }, [token, dispatch]);

    if (isAuth === null) {
        // You can add a loading spinner here if needed
        return <Preloader/>;
    }

    const childType = children.type?.componentName;

    console.log(childType);

    const isAuthPage = ['Signin', 'Signup', 'ForgotPassword'].includes(childType);

    if(childType === 'VenderList' && isAuth !== null){
        return children;
    }

    if (isAuthPage && isAuth) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return <Navigate to="/" />;
    }

    if (!isAuth && !isAuthPage) {
        return <Navigate to="/sign-in" />;
    }

    return children;
}

export default ProtectedRoute;

