import React, { createContext, useState, useContext } from "react";

type dataType = {
  id: string;
  list: Array<string>;
  name: string;
};

type contextType = [
  dataType[],
  React.Dispatch<React.SetStateAction<dataType[]>>
];

const context = createContext<contextType>([[], () => void 0]);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [directoryList, setDirectoryList] = useState<dataType[]>([]);

  return (
    <context.Provider value={[directoryList, setDirectoryList]}>
      {children}
    </context.Provider>
  );
};

export const useDirectoryContext = (): contextType => {
  const [directoryList, setDirectoryList] = useContext(context);

  return [directoryList, setDirectoryList];
};
