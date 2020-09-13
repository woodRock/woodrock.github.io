import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext([]);
const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export { useTheme };
