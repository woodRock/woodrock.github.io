import React, { createContext, useContext } from "react";
import fetch from "./Firebase";

const FirebaseContext = createContext({});
const useFirebase = () => useContext(FirebaseContext);

const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ fetch }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
export { useFirebase };
