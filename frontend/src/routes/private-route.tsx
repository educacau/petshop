import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from '../hooks/useAuth';
import type {Role} from '../types';

interface PrivateRouteProps {
  roles: Role[];
  redirect?: string;
}

export const PrivateRoute = ({roles, redirect = '/login'}: PrivateRouteProps) => {
  const {isAuthenticated, user} = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirect} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
