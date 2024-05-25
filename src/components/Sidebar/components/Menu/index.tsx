import React, { useEffect, useState } from "react";
import "./index.less";
import ArrowIcon from "components/ArrowIcon";
import { PER_ROW_COUNT, SINGLE_ROW_HEIGHT } from "./constant";
import { useDirectoryContext } from "../../context";

const Menu: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>();
  const [subItemHeight, setSubItemHeight] = useState<number>(0);
  const [directoryList] = useDirectoryContext();

  const clickHandler = (key: string) => {
    if (key === activeKey) setActiveKey(undefined);
    else setActiveKey(key);
  };

  useEffect(() => {
    const activeItem = directoryList.find((c) => c.id === activeKey);
    const height = Math.ceil((activeItem?.list?.length || 0) / PER_ROW_COUNT);

    setSubItemHeight(height * SINGLE_ROW_HEIGHT);
  }, [activeKey, directoryList]);

  return (
    <ul className="ym-menu">
      {directoryList.map((c) => {
        return (
          <li key={c.id}>
            <div
              className="ym-menu-title"
              onClick={() => {
                clickHandler(c.id);
              }}
            >
              {c.name} <ArrowIcon rotate={activeKey === c.id} />
            </div>
            <ul
              className="ym-subitem-menu"
              style={{ height: activeKey === c.id ? `${subItemHeight}px` : 0 }}
            >
              {c.list.map((s) => (
                <li className="ym-subitem" key={s}>
                  {s}
                </li>
              ))}
              {Array.from({ length: PER_ROW_COUNT }).map((_, idx) => (
                <div key={idx} className="ym-empty-item" />
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
