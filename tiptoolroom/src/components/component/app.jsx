import React, { createContext, useState } from 'react';
import { ToolboxCompile } from '@/components/component/toolbox-compile';
import {Items } from "./items"
export const ToolboxContext = createContext();

export default function App() {
  const [state, setState] = useState([]); // Initialize your state here

 return (
    <ToolboxContext.Provider value={{ state, setState }}>
      <Items />
      <ToolboxCompile />
    </ToolboxContext.Provider>
 );
}
