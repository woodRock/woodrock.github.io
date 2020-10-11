import React, { createContext, useContext, useReducer } from "react";

const ThemeContextState = createContext([]);

const ThemeContextDispatch = createContext([]);

const useThemeState = () => useContext(ThemeContextState);

const useThemeDispatcher = () => useContext(ThemeContextDispatch);

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle":
      const next = state.theme === "dark" ? "light" : "dark";
      return { theme: next };
    default:
      return { theme: "dark" };
  }
};

const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { theme: "dark" });
  return (
    <ThemeContextState.Provider value={state}>
      <ThemeContextDispatch.Provider value={dispatch}>
        {children}
      </ThemeContextDispatch.Provider>
    </ThemeContextState.Provider>
  );
};

export default ThemeProvider;
export { useThemeState, useThemeDispatcher };
