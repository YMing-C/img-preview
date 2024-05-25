import React from "react";
import { Input } from "antd";
import "./index.less";
import { Menu, Header } from "./components";

const Sidebar: React.FC = () => {
  return (
    <div className="ym-sidebar">
      <Header />
      <div className="ym-nav-search">
        <Input placeholder="emmm.." />
      </div>
      <Menu />
    </div>
  );
};

export default Sidebar;
