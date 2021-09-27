import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import logo from "../assets/logo.png";

/**
 * Attachs a static mesh to 3D rotating box. 
 * @param {React.Component} props 
 * @returns A rotating box with a texture.
 */
const Box = (props) => {
  const mesh = useRef();

  // Store state for if user is clicking on the box.
  const [active, setActive] = useState(false);

  // Update mesh rotation on each frame
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  // Load the static-mesh once (i.e memoize)
  const texture = useMemo(
    () => new THREE.TextureLoader().load(logo), [],
  );

  return (
    <mesh
      { ...props }
      onClick={ () => setActive(!active) }
      ref={ mesh } // Size changes when user clicks the box.
      scale={ active ? [2, 2, 2] : [1.5, 1.5, 1.5] }
    >
      <boxBufferGeometry args={ [2, 2, 2] } />
      <meshBasicMaterial attach="material" side={ THREE.DoubleSide }>
        <primitive attach="map" object={ texture } />
      </meshBasicMaterial>
    </mesh>
  );
};

export default Box;
