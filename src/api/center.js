/**
 * Center - center.js
 * ==================
 *
 * The center context is used to store the center of the map.
 * We may wish to update the center of the map when the user clicks on a location.
 * Using a context allows us to update the center of the map globally.
 *
 * Justifcation:
 * The center context plays nicely with the react leaftlet library.
 * By default MapContainer is immutable, therefore we can't simply update the center prop.
 * But we can use react leafelet hooks in child components to update the center of the map.
 */

import React, { createContext, useContext, useState } from "react";

// GPS coordinates of Wellington.
const DEFAULT_CENTER = [-41.31, 174.79];

/**
 * The center context is used to store the center of the map.
 * @param {*} children are the child components.
 * @returns the center context provider.
 */
const CenterProvider = ({ children }) => {
  const [center, setCenter] = useState(DEFAULT_CENTER);

  const updateCenter = (newCenter) => {
    setCenter(newCenter);
  };

  // Resets the center to the default. Used when the user clicks the home button.
  const reset = () => setCenter(DEFAULT_CENTER);

  return (
    <CenterContext.Provider value={{ center, updateCenter, reset }}>
      {children}
    </CenterContext.Provider>
  );
};

/**
 * Hook to access the center context.
 * @returns the center context.
 */
const useCenter = () => {
  const context = useContext(CenterContext);
  if (context === undefined) {
    throw new Error("useCenter must be used within a CenterProvider");
  }
  return context;
};

/**
 * The center context.
 */
const CenterContext = createContext();

export { CenterProvider, useCenter, DEFAULT_CENTER };
