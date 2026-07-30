import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
