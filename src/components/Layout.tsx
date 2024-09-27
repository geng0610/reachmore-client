import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';
// import './Layout.scss'; // Import your custom styles for layout

const Layout: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="d-flex vh-100 row">
        {/* Sidebar for desktop */}
        <div className="flex-column flex-shrink-0 p-3 text-bg-dark h-100 d-none d-md-flex col-md-3 col-lg-2">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="col-md-9 col-lg-10 p-0">
          {/* Top bar for mobile */}
          <TopBar />
          
          {/* Outlet to render child routes */}

          <Outlet />  
        </div>
      </div>
    </div>
  );
};

export default Layout;

