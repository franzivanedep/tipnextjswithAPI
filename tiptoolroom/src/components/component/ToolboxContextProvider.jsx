import React, { createContext, useContext } from 'react';
React.createContext()
const ToolboxContext = createContext();

export const useToolboxContext = () => {
  return useContext(ToolboxContext);
};

export const ToolboxContextProvider = ({ children }) => {
  const [toolboxItems, setToolboxItems] = React.useState([]);

  const addItemToToolbox = (item) => {
    setToolboxItems([...toolboxItems, { ...item, id: item.i_id }]);
  };

  return (
    <ToolboxContext.Provider value={{ toolboxItems, addItemToToolbox }}>
      {children}
    </ToolboxContext.Provider>
  );
};
