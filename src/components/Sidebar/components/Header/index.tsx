import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./index.less";

const Header: React.FC = () => {
  return (
    <div className="ym-header">
      <div className="ym-logo">IMG-PREVIEW</div>
      {/* TODO 点击后添加本地文件目录 */}
      <PlusCircleOutlined className="ym-add-icon" />
    </div>
  );
};

export default Header;
