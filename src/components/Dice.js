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

import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Box from "./Box";

const Dice = () => {

  dice_center, set_dice_center = useState([0, 0, 0]);

  // Move the dice randomly around the screen.
  const move_dice = () => {
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * 10 - 5;
    set_dice_center([x, y, z]);
  };

  // Move the dice every 0.1 seconds.
  setInterval(move_dice, `100`);

  return (
  <React.Fragment>
    <Link to="/">Home</Link>
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight angle={0.15} penumbra={1} position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={dice_center} />
    </Canvas>
  </React.Fragment>
  );
}

export default Dice;
