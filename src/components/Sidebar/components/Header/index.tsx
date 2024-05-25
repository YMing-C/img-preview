import React, { useEffect, useMemo } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./index.less";
import { debounce } from "lodash";
import { useDirectoryContext } from "../../context";

const { ipcRenderer } = window.require("electron");

const Header: React.FC = () => {
  const [, setDirectoryList] = useDirectoryContext();

  const debounceClickHandler = useMemo(
    () =>
      debounce(
        () => {
          ipcRenderer.send("open-directory-select-dialog");
        },
        200,
        { leading: true, trailing: false }
      ),
    []
  );

  useEffect(() => {
    const listener = (e, res) => {
      const pathArr = res.path.split("\\");
      const directoryName = pathArr[pathArr.length - 1];
      setDirectoryList([
        {
          id: crypto.randomUUID(),
          name: directoryName,
          list: ["img-1", "img-2", "img-3", "img-4", "img-5", "img-6"],
        },
      ]);
    };

    ipcRenderer.on("selected-directory", listener);
    return () => {
      ipcRenderer.off("selected-directory", listener);
    };
  }, []);

  return (
    <div className="ym-header">
      <div className="ym-logo">IMG-PREVIEW</div>
      <PlusCircleOutlined
        className="ym-add-icon"
        onClick={debounceClickHandler}
      />
    </div>
  );
};

export default Header;
