import React from "react";
import "./index.less";
import { ArrowIconProps } from "./interface";

const ArrowIcon: React.FC<ArrowIconProps> = ({ rotate = false }) => {
  return (
    <div className="arrow-icon-wrap">
      <i className={`arrow-icon${rotate ? " rotate" : ""}`} />
    </div>
  );
};

export default ArrowIcon;
