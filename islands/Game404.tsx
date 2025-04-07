// islands/MazeGame.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "npm:three";

// Interface for touch controls state management
interface TouchControls {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  lastTouch: { x: number; y: number } | null;
}

export default function MazeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState("Loading...");
  const [mobileControlsEnabled, setMobileControlsEnabled] = useState(false);

  // Lock screen orientation to landscape
  const lockScreenOrientation = () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(err => {
          console.warn("Unable to lock screen orientation:", err);
        });
      }
    } catch (error) {
      console.warn("Screen orientation API not supported");
    }
  };
  
  // Unlock screen orientation
  const unlockScreenOrientation = () => {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (error) {
      console.warn("Error unlocking screen orientation:", error);
    }
  };

  // Toggle for mobile controls
  const toggleMobileControls = () => {
    const newState = !mobileControlsEnabled;
    setMobileControlsEnabled(newState);
    
    if (newState) {
      lockScreenOrientation();
    } else {
      unlockScreenOrientation();
    }
  };

  useEffect(() => {
    // Game state
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let walls: THREE.Mesh[] = [];
    let goal: THREE.Mesh;
    let minimapCtx: CanvasRenderingContext2D | null = null;
    let cleanupFunction: (() => void) | null = null;
    let animationFrameId: number;
    let lastFrameTime = 0;

    // Tracking player path
    const visitedCells = new Set<string>();
    const mazeSize = 30;
    const wallWidth = 1;

    // Input state
    const inputState = {
      keyboard: {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false
      },
      touch: {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        lastTouch: null as { x: number; y: number } | null
      }
    };

    // Camera setup
    const cameraHolder = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    cameraHolder.add(camera);

    // Movement and camera control
    const moveSpeed = 5.0; // Units per second, not per frame

    // Maze generation
    function generateMaze(width: number, height: number): number[][] {
      // Create a maze filled with walls
      const maze: number[][] = Array.from({ length: height }, () => 
        Array(width).fill(1)
      );

      // Ensure outer boundary is always a wall
      for (let x = 0; x < width; x++) {
        maze[0][x] = 1;
        maze[height - 1][x] = 1;
      }
      for (let y = 0; y < height; y++) {
        maze[y][0] = 1;
        maze[y][width - 1] = 1;
      }

      function carvePassages(x: number, y: number) {
        const directions = [
          [0, 2], [2, 0], [0, -2], [-2, 0]
        ].sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;

          // Check if new position is within bounds and not already a passage
          if (
            nx > 0 && nx < width - 1 && 
            ny > 0 && ny < height - 1 && 
            maze[ny][nx] === 1
          ) {
            // Carve passage
            maze[y + dy/2][x + dx/2] = 0;
            maze[ny][nx] = 0;
            carvePassages(nx, ny);
          }
        }
      }

      // Start from a random point
      const startX = 2 * Math.floor(Math.random() * ((width - 2) / 2)) + 1;
      const startY = 2 * Math.floor(Math.random() * ((height - 2) / 2)) + 1;
      
      // Ensure start is open
      maze[startY][startX] = 0;
      
      // Generate maze
      carvePassages(startX, startY);

      // Ensure start and end are accessible
      maze[1][1] = 0;
      maze[height - 2][width - 2] = 0;

      return maze;
    }

    const maze = generateMaze(mazeSize, mazeSize);
      
    function createSolidWalls(scene: THREE.Scene) {
      const wallHeight = 3;
      
      // Wall Material
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.7,
        metalness: 0.3
      });

      // Wall Geometry
      const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallWidth);
      const walls: THREE.Mesh[] = [];

      // Create walls for every wall cell in the maze without gaps
      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[z][x] === 1) {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            // Position walls directly adjacent to each other without the gap
            wall.position.set(
              x * wallWidth - (mazeSize * wallWidth / 2),
              wallHeight / 2,
              z * wallWidth - (mazeSize * wallWidth / 2)
            );
            wall.castShadow = true;
            wall.receiveShadow = true;
            scene.add(wall);
            walls.push(wall);
          }
        }
      }

      return walls;
    }

  // Collision Detection Functions
  function checkCollisionWithSliding(currentPosition: THREE.Vector3, attemptedMovement: THREE.Vector3): THREE.Vector3 {
    const playerRadius = 0.3;
    const wallTolerance = 0.51; // Slightly larger than player radius
    
    // Attempt to move
    const attemptedPosition = currentPosition.clone().add(attemptedMovement);
    
    // Comprehensive wall collision check
    function isCollidingWithWalls(position: THREE.Vector3): boolean {
      return walls.some(wall => {
        // More precise distance calculation considering wall geometry
        const wallHalfWidth = wallWidth / 2;
        
        // Check if the position is within the wall's bounds
        const inXBounds = Math.abs(position.x - wall.position.x) < (wallHalfWidth + playerRadius);
        const inZBounds = Math.abs(position.z - wall.position.z) < (wallHalfWidth + playerRadius);
        
        // If within bounds in both X and Z, consider it a collision
        return inXBounds && inZBounds;
      });
    }
    
    // Check if attempted position collides
    if (isCollidingWithWalls(attemptedPosition)) {
      // If collision detected, prevent movement
      return currentPosition;
    }
    
    // If no collision, allow movement
    return attemptedPosition;
  }

  // Strict collision check function
  function checkCollision(position: THREE.Vector3): boolean {
    const playerRadius = 0.3;
    const wallTolerance = 0.51;
    
    return walls.some(wall => {
      const wallHalfWidth = wallWidth / 2;
      
      // Check if the position is within the wall's bounds
      const inXBounds = Math.abs(position.x - wall.position.x) < (wallHalfWidth + playerRadius);
      const inZBounds = Math.abs(position.z - wall.position.z) < (wallHalfWidth + playerRadius);
      
      // If within bounds in both X and Z, consider it a collision
      return inXBounds && inZBounds;
    });
  }

  // Multi-touch handler for movement joystick
  function handleMultiTouchMovement(e: TouchEvent, joystickBg: HTMLElement, joystickKnob: HTMLElement) {
    if (e.touches.length === 0) return;
    
    const rect = joystickBg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Reset movement flags
    inputState.touch.moveForward = false;
    inputState.touch.moveBackward = false;
    inputState.touch.moveLeft = false;
    inputState.touch.moveRight = false;
    
    // Track touches within this joystick area
    const touchesInJoystick = Array.from(e.touches).filter(touch => {
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      return (
        touchX >= rect.left && 
        touchX <= rect.right && 
        touchY >= rect.top && 
        touchY <= rect.bottom
      );
    });
    
    // If no touches in this joystick area, reset
    if (touchesInJoystick.length === 0) {
      joystickKnob.style.transform = 'translate(0, 0)';
      return;
    }
    
    // Use the first touch for joystick calculation
    const touch = touchesInJoystick[0];
    
    // Calculate distance from center
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), rect.width / 2);
    const angle = Math.atan2(deltaY, deltaX);
    
    // Move joystick knob
    const knobX = Math.cos(angle) * distance;
    const knobY = Math.sin(angle) * distance;
    joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
    
    // Set direction flags
    const deadzone = 0.3;
    const normalizedDistance = distance / (rect.width / 2);
    
    if (normalizedDistance > deadzone) {
      // Set appropriate movement flags based on angle
      if (angle > -Math.PI * 0.75 && angle < -Math.PI * 0.25) {
        inputState.touch.moveForward = true;
      } else if (angle > Math.PI * 0.25 && angle < Math.PI * 0.75) {
        inputState.touch.moveBackward = true;
      }
      
      if (angle > -Math.PI * 0.25 && angle < Math.PI * 0.25) {
        inputState.touch.moveRight = true;
      } else if (Math.abs(angle) > Math.PI * 0.75) {
        inputState.touch.moveLeft = true;
      }
    }
  }

  // Multi-touch handler for look area
  function handleMultiTouchLook(e: TouchEvent) {
    if (e.touches.length === 0) return;
    
    // Track potential look touches (those outside movement joystick)
    const lookTouches = Array.from(e.touches).filter(touch => {
      const movementJoystick = document.querySelector('.movement-joystick');
      if (!movementJoystick) return true;
      
      const rect = movementJoystick.getBoundingClientRect();
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      
      // Exclude touches within movement joystick area
      return !(
        touchX >= rect.left && 
        touchX <= rect.right && 
        touchY >= rect.top && 
        touchY <= rect.bottom
      );
    });
    
    // If no valid look touches, reset
    if (lookTouches.length === 0) {
      inputState.touch.lastTouch = null;
      return;
    }
    
    // Use the first valid look touch
    const touch = lookTouches[0];
    
    if (inputState.touch.lastTouch) {
      // Calculate movement delta
      const deltaX = touch.clientX - inputState.touch.lastTouch.x;
      const deltaY = touch.clientY - inputState.touch.lastTouch.y;
      
      // Update camera rotation (similar to mouse movement)
      cameraHolder.rotation.y -= deltaX * 0.01;
      camera.rotation.x -= deltaY * 0.01;
      
      // Clamp pitch to prevent over-rotation
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
    }
    
    // Update last touch position
    inputState.touch.lastTouch = { x: touch.clientX, y: touch.clientY };
  }

  // Remaining code continues with the game's initialization and rendering...
  // (The rest of the code from the previous artifacts would follow here)
}, [mobileControlsEnabled]);

// Render method remains the same as in the previous implementation
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={minimapRef}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          border: '2px solid white',
          backgroundColor: 'rgba(255,255,255,0.5)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '15px',
          borderRadius: '10px'
        }}
      >
        <h3>Maze Challenge</h3>
        <p>WASD: Move</p>
        <p>Click to look around</p>
        <p>Status: {gameStatus}</p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 15px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px'
        }}
      >
        <span>Mobile Controls:</span>
        <label
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '40px',
            height: '20px',
            marginLeft: '10px'
          }}
        >
          <input
            type="checkbox"
            checked={mobileControlsEnabled}
            onChange={toggleMobileControls}
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span
            style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: mobileControlsEnabled ? '#2196F3' : '#ccc',
              transition: '.4s',
              borderRadius: '34px'
            }}
          >
            <span
              style={{
                position: 'absolute',
                content: '""',
                height: '14px',
                width: '14px',
                left: mobileControlsEnabled ? '23px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '.4s',
                borderRadius: '50%'
              }}
            />
          </span>
        </label>
      </div>

      {mobileControlsEnabled && (
        <div
          style={{
            position: 'absolute',
            top: '170px',
            left: '10px',
            color: 'white',
            background: 'rgba(0,0,0,0.7)',
            padding: '10px 15px',
            borderRadius: '10px',
            fontSize: '14px'
          }}
        >
          <p>Left joystick: Move</p>
          <p>Right area: Look around</p>
        </div>
      )}
    </div>
  );
}