'use client';

import { createContext, useContext, useState } from 'react';

const RangeContext = createContext();

const initialState = { from: undefined, to: undefined };

function RangeProvider({ children }) {
  const [range, setRange] = useState({initialState});
  const resetRange = ()=> setRange(initialState);
  return (
    <RangeContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </RangeContext.Provider>
  );
}

export function useRange()
{
    const context = useContext(RangeContext);
    if(!context) throw new Error('context was used out of RangeProvider');
    return context;
}

export default RangeProvider;

