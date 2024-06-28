import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuth = Boolean(useSelector((state) => state.token));

    const isSignInComponent = children.type && children.type.name === 'Signin';
    const isSignUpComponent = children.type && children.type.name === 'Signup';

    if (isSignInComponent || isSignUpComponent) {
        if (isAuth) {
            // return <Navigate to="/" />;
            window.location.href = '/';
            return null; 
        } else {
            return children;
        }
    } else {
        if (!isAuth) {
            // return <Navigate to="/sign-in" />;
            window.location.href = '/sign-in';
            return null;
        }
        return children;
    }
}

export default ProtectedRoute;
