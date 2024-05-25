import React from "react";
import { Input } from "antd";
import styles from "./index.module.less";
import { Menu, Header } from "./components";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <Header />
      <div className={styles.navSearch}>
        <Input placeholder="emmm.." />
      </div>
      <Menu />
    </div>
  );
};

export default Sidebar;
