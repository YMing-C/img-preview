import React from "react";
import { Input } from "antd";
import "./index.less";
import { Menu, Header } from "./components";
import { ContextProvider } from "./context";

const Sidebar: React.FC = () => {
  return (
    <ContextProvider>
      <div className="ym-sidebar">
        <Header />
        <div className="ym-nav-search">
          <Input placeholder="emmm.." />
        </div>
        <Menu />
      </div>
    </ContextProvider>
  );
};

export default Sidebar;
