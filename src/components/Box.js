/**
 * Box component - Box.js
 * ======================
 *
 * The Box component is a 3D box that can be rotated.
 * It attaches a static mesh to a 3D rotating box.
 * We put our logo as the face of each side of that cube.
 * This component uses the [Threejs]{@link https://threejs.org/} library.
 * The dice changes size when it is clicked.
 */

import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import logo from "../assets/logo.png";

/**
 * @param {React.Component} props
 * @returns A rotating box with a texture.
 */
const Box = (props) => {
  const mesh = useRef();

  const [active, setActive] = useState(false);

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  const texture = useMemo(() => new THREE.TextureLoader().load(logo), []);

  return (
    <mesh
      {...props}
      onClick={() => setActive(!active)}
      ref={mesh} // Size changes when user clicks the box.
      scale={active ? [1, 1, 1] : [0.5, 0.5, 0.5]}
    >
      <boxBufferGeometry args={[2, 2, 2]} />
      <meshBasicMaterial attach="material" side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
};

export default Box;
