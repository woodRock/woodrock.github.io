import React, { createContext, useContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import config from "./config";

/**
 * Firebase context stores all the implementation details for firebase.
 */
const FirebaseContext = createContext(undefined);

/**
 * Syntax sugar for using the firebase context.
 * Additional error handling to provide context sensitive exceptions.
 */
const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseContext.");
  }
  return context;
};

/**
 * This is the provider for the context.
 * We provide it at the root level of the component tree.
 * All subcomponents can access this context.
 */
const FirebaseProvider = ({ children }) => {
  firebase.initializeApp(config);
  const db = firebase.firestore();

  /**
   * Most components simply need to fetch a collection
   * We perform artitrary sorting based on a particular key.
   * We sort the collection by an existing field in descending order.
   */
  const fetch = (collection, sort = "time", order, observer) => {
    order = order || "desc";
    db.collection(collection).orderBy(sort, order).onSnapshot(observer);
  };

  return (
    <FirebaseContext.Provider value={{ fetch }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
export { useFirebase };
