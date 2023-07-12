import React from 'react';
import { Redirect, Outlet } from 'react-router-dom';

// import Auth from './Auth';

const PublicRoute = () => {
  const auth = localStorage.getItem('token');
  return auth ? <Redirect to={`/dashboard`} /> : <Outlet />;
};

export default PublicRoute;
