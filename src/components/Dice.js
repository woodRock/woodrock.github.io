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

import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Box from "./Box";
import { HomeButton } from "./Buttons";
import "./Dice.css";

const Dice = () => {

  const [dice_center, set_dice_center] = useState([0, 0, 0]);

  // Move the dice randomly around the screen.
  const move_dice = () => {
    const x = Math.random() * 4 - 2;
    const y = Math.random() * 4 - 2;
    const z = Math.random() * 1 - 0.5;
    set_dice_center([x, y, z]);
  };

  useEffect(() => {
    // Move the dice every 2 seconds
    const interval = setInterval(() => {
      move_dice()
    }, 2_000);
    return () => clearInterval(interval);
  }, []);
  

  return (
  <>
    <HomeButton />
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight angle={0.15} penumbra={1} position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={dice_center} />
    </Canvas>
  </>
  );
}

export default Dice;
