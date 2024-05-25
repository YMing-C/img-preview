import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.less";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>IMG-PREVIEW</div>
      {/* TODO 点击后添加本地文件目录 */}
      <PlusCircleOutlined className={styles.addIcon} />
    </div>
  );
};

export default Header;
