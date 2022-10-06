/**
 * Is Mobile? - IsMobile.js
 * ========================
 * 
 * Simple react hook to detect if the user is on a mobile device. 
 * Source: https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
 */

import { useState, useEffect } from "react";

const useIsMobile = () => {

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    
    return width <= 768;
}

export default useIsMobile;