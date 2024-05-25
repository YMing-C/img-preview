import React from "react";
import Sidebar from "components/Sidebar";
import { Outlet } from "react-router-dom";
import "./index.less";

const Layout: React.FC = () => {
  return (
    <div className="ym-layout">
      <Sidebar />
      <div className="ym-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
