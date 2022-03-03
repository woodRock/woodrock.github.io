/**
 * Dice component - Dice.js
 * ========================
 * 
 * The Dice component is a 3D cube that can be rolled.
 * This component uses the [Threejs]{@link https://threejs.org/} library.
 * We put our logo as the face of each side of that cube. 
 * This would make an interesting "retro" loading screen. 
 * By default this die, links to the home page when clicked. 
 */

import React from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Box from "./Box";

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

