import React from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Box from "./Box";

/**
 * Displays a Box on a 3D canvas.
 */
const Dice = () => (
  <React.Fragment>
    <Link to="/">Home</Link>
    <Canvas>  
      <ambientLight intensity={ 0.5 } /> 
      <spotLight angle={ 0.15 } penumbra={ 1 } position={ [10, 10, 10] } />
      <pointLight position={ [-10, -10, -10] } />
      <Box position={ [0 , 0, 0] } />
    </Canvas>
  </React.Fragment>
);

export default Dice;

