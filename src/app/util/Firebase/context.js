import React, { createContext, useContext } from "react";
import fetch from "./firebase";

const FirebaseContext = createContext({});
export const useFirebase = () => useContext(FirebaseContext);

export default function FirebaseProvider({ children }) {
  return (
    <FirebaseContext.Provider value={{ fetch }}>
      {children}
    </FirebaseContext.Provider>
  );
}
