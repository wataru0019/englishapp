'use client';

import { createContext, useState, useContext } from 'react';

const WordContext = createContext();

export function WordProvider({ children }) {
  const [selectedText, setSelectedText] = useState('');
  
  const value = {
    selectedText,
    setSelectedText
  };
  
  return (
    <WordContext.Provider value={value}>
      {children}
    </WordContext.Provider>
  );
}

export function useWordContext() {
  return useContext(WordContext);
}
