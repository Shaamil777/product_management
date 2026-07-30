import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
