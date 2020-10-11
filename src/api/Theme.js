import React, { createContext, useContext, useReducer } from "react";

/**
 * This stores the state for the theme context.
 * That is a string value, which is `light` or `dark`.
 */
const ThemeContextState = createContext(undefined);

/**
 * This stores the dispatch for the theme context.
 * It handles the actions we can perform on the state.
 * We can `toggle` the state, from `light` to `dark`, or vice versa.
 */
const ThemeContextDispatch = createContext(undefined);

/**
 * Syntax sugar for using the context theme's state
 * Additional error handling to provide context sensitive exceptions.
 */
const useThemeState = () => {
  const context = useContext(ThemeContextState);
  if (context === undefined) {
    throw new Error(
      "useThemeState must be used within a ThemeContextState context."
    );
  }
  return context;
};

/**
 * Syntax sugar for using the context theme's dispatch.
 * Additional error handling to provide context sensitive exceptions.
 */
const useThemeDispatcher = () => {
  const context = useContext(ThemeContextDispatch);
  if (context === undefined) {
    throw new Error(
      "useThemeDispatcher must be used within a ThemeContextDispatch context."
    );
  }
  return context;
};

/**
 * Performs actions of the state of the theme context.
 * Here we can toggle the existing state of the theme.
 */
const reducer = (state, action) => {
  switch (action.type) {
    case "toggle":
      return { theme: toggle(state.theme) };
    default:
      return { theme: "dark" };
  }
};

/**
 * Provider for the theme context.
 * This must be supplied at a parent or node that wishes to use it.
 * We nest the dispatch inside the state, order is important here.
 */
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

/**
 * Utility method to return the inverted theme.
 * It toggles the input from light to dark, or vice versa.
 */
const toggle = (theme) => {
  return theme === "dark" ? "light" : "dark";
};

export default ThemeProvider;
export { useThemeState, useThemeDispatcher };
