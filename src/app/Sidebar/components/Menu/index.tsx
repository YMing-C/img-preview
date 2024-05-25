import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { ArrowIcon } from "components";
import { dataType, PER_ROW_COUNT, SINGLE_ROW_HEIGHT } from "./interface";

const mockLi: Array<dataType> = [
  {
    id: "1",
    name: "图集1",
    list: ["img-1", "img-2", "img-3", "img-4", "img-5", "img-6"],
  },
  {
    id: "2",
    name: "图集2",
    list: ["img-1", "img-2", "img-3", "img-4", "img-5", "img-6"],
  },
  {
    id: "3",
    name: "图集3",
    list: ["img-1", "img-2", "img-3", "img-4", "img-5", "img-6"],
  },
  {
    id: "4",
    name: "图集4",
    list: ["img-1", "img-2", "img-3", "img-4", "img-5", "img-6"],
  },
  {
    id: "5",
    name: "图集5",
    list: ["img-1", "img-2", "img-3", "img-4", "img-5", "img-6"],
  },
];

const Menu: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>();
  const [subItemHeight, setSubItemHeight] = useState<number>(0);

  const clickHandler = (key: string) => {
    if (key === activeKey) setActiveKey(undefined);
    else setActiveKey(key);
  };

  useEffect(() => {
    const activeItem = mockLi.find((c) => c.id === activeKey);
    const height = Math.ceil((activeItem?.list?.length || 0) / PER_ROW_COUNT);

    setSubItemHeight(height * SINGLE_ROW_HEIGHT);
  }, [activeKey]);

  return (
    <ul className={styles.menu}>
      {mockLi.map((c) => {
        return (
          <li key={c.id}>
            <div
              className={styles.menuTitle}
              onClick={() => {
                clickHandler(c.id);
              }}
            >
              {c.name} <ArrowIcon rotate={activeKey === c.id} />
            </div>
            <ul
              className={styles.subItemMenu}
              style={{ height: activeKey === c.id ? `${subItemHeight}px` : 0 }}
            >
              {c.list.map((s) => (
                <li className={styles.subItem} key={s}>
                  {s}
                </li>
              ))}
              {Array.from({ length: PER_ROW_COUNT }).map((_, idx) => (
                <div key={idx} className={styles.emptyItem} />
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
