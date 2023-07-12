import React from 'react';
import { Redirect, Outlet } from 'react-router-dom';

// import Auth from '../utils/Auth';

const ProtectedRoute = () => {
  const auth = localStorage.getItem('token');
  return auth ? <Outlet /> : <Redirect to={`/login`} />;
};

export default ProtectedRoute;
