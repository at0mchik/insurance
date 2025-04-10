import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    const role = getUserRole();

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
