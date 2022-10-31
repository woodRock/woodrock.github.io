/**
 * Is Mobile? - IsMobile.js
 * ========================
 *
 * Simple react hook to detect if the user is on a mobile device.
 * Source: https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
 */

import { useState, useEffect } from "react";

// The minimum width of the screen to be considered a mobile device.
// Very crude - but it works.
const MINIMUM_MOBILE_WIDTH = 768;

const useIsMobile = () => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return width <= MINIMUM_MOBILE_WIDTH;
};

export default useIsMobile;
