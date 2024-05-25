import React from "react";
import Sidebar from "components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div>
      <Sidebar />
      <div className="ym-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
