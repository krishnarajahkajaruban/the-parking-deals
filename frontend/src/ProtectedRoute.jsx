import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import api from './api';
import { setLogout } from './state';

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
        return <div>Loading...</div>;
    }

    const childType = children.type?.componentName;

    console.log(childType);

    const isAuthPage = ['Signin', 'Signup', 'ForgotPassword'].includes(childType);

    if (isAuthPage && isAuth) {
        return <Navigate to="/" />;
    }

    if (!isAuth && !isAuthPage) {
        return <Navigate to="/sign-in" />;
    }

    return children;
}

export default ProtectedRoute;

