// contexts/ThemeContext.js

import React, { createContext, useContext, useState } from 'react';
import { LightColors, DarkColors } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);
  const colors = isDarkMode ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
