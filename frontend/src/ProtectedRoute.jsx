import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuth = Boolean(useSelector((state) => state.auth.token));

    console.log(children);
    const childType = children.type?.name;

    console.log('Child Type:', childType);
    console.log('Is Auth:', isAuth);

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
