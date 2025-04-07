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

    // Maze data
    const maze = generateMaze(mazeSize, mazeSize);
    
    // Add "404" digits in the center of the maze
    function add404ToMaze(maze: number[][]) {
      // Calculate the center position
      const centerX = Math.floor(mazeSize / 2) - 5; // Offset to center the digits
      const centerY = Math.floor(mazeSize / 2) - 2; // Offset to center vertically
      
      // Define the 404 pattern (1 = wall, 0 = path)
      const digit404 = [
        // First 4
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
        // 0
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        // Second 4
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
      ];
      
      // Place the digits in the maze (if space allows)
      for (let y = 0; y < digit404.length; y++) {
        for (let x = 0; x < digit404[0].length; x++) {
          if (centerY + y < maze.length && centerX + x < maze[0].length) {
            // Only place walls (don't erase existing paths to maintain maze connectivity)
            if (digit404[y][x] === 1) {
              maze[centerY + y][centerX + x] = 1;
            }
          }
        }
      }
      
      return maze;
    }
    
    // Add the 404 digits to the maze
    add404ToMaze(maze);

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

    // Handle touch controls
    function handleMovementTouch(e: TouchEvent, joystickBg: HTMLElement, joystickKnob: HTMLElement) {
      if (e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = joystickBg.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
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
      
      // Reset all movement flags first
      inputState.touch.moveForward = false;
      inputState.touch.moveBackward = false;
      inputState.touch.moveLeft = false;
      inputState.touch.moveRight = false;
      
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
    
    function resetMovementJoystick(joystickKnob: HTMLElement) {
      joystickKnob.style.transform = 'translate(0, 0)';
      inputState.touch.moveForward = false;
      inputState.touch.moveBackward = false;
      inputState.touch.moveLeft = false;
      inputState.touch.moveRight = false;
    }
    
    function handleLookTouch(e: TouchEvent) {
      if (e.touches.length === 0) return;
      
      const touch = e.touches[0];
      
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

    // Create Touch Controls
    function createTouchControls(container: HTMLDivElement) {
      // Remove existing controls if they exist
      removeExistingTouchControls();
      
      // Create joystick for movement
      const movementJoystick = document.createElement('div');
      movementJoystick.className = 'joystick movement-joystick';
      movementJoystick.innerHTML = `
        <div class="joystick-background">
          <div class="joystick-knob"></div>
        </div>
        <div class="joystick-arrows">
          <div class="arrow up">▲</div>
          <div class="arrow right">▶</div>
          <div class="arrow down">▼</div>
          <div class="arrow left">◀</div>
        </div>
      `;
      container.appendChild(movementJoystick);
      
      // Create look area for camera control
      const lookArea = document.createElement('div');
      lookArea.className = 'look-area';
      lookArea.innerHTML = '<div class="look-text">LOOK</div>';
      container.appendChild(lookArea);
      
      // Add styles
      const existingStyle = document.getElementById('touch-controls-style');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'touch-controls-style';
        style.textContent = `
          .joystick {
            position: absolute;
            width: 120px;
            height: 120px;
            z-index: 100;
            user-select: none;
            touch-action: none;
          }
          .movement-joystick {
            bottom: 30px;
            left: 30px;
          }
          .joystick-background {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .joystick-knob {
            width: 40%;
            height: 40%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            pointer-events: none;
            transform: translate(0, 0);
          }
          .joystick-arrows {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          .arrow {
            position: absolute;
            color: white;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
          }
          .arrow.up { top: 10px; left: 50%; transform: translateX(-50%); }
          .arrow.right { right: 10px; top: 50%; transform: translateY(-50%); }
          .arrow.down { bottom: 10px; left: 50%; transform: translateX(-50%); }
          .arrow.left { left: 10px; top: 50%; transform: translateY(-50%); }
          .look-area {
            position: absolute;
            bottom: 30px;
            right: 30px;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            touch-action: none;
          }
          .look-text {
            color: white;
            font-weight: bold;
            font-size: 18px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
          }
        `;
        document.head.appendChild(style);
      }
      
      // Movement joystick handlers
      const joystickBg = movementJoystick.querySelector('.joystick-background') as HTMLElement;
      const joystickKnob = movementJoystick.querySelector('.joystick-knob') as HTMLElement;
      
      joystickBg.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleMovementTouch(e, joystickBg, joystickKnob);
      });
      
      joystickBg.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleMovementTouch(e, joystickBg, joystickKnob);
      });
      
      joystickBg.addEventListener('touchend', (e) => {
        e.preventDefault();
        resetMovementJoystick(joystickKnob);
      });
      
      // Look area handlers
      lookArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleLookTouch(e);
      });
      
      lookArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleLookTouch(e);
      });
      
      lookArea.addEventListener('touchend', (e) => {
        e.preventDefault();
        inputState.touch.lastTouch = null;
      });
    }

    // Remove existing touch controls
    function removeExistingTouchControls() {
      if (containerRef.current) {
        const joystick = containerRef.current.querySelector('.movement-joystick');
        const lookArea = containerRef.current.querySelector('.look-area');
        if (joystick) containerRef.current.removeChild(joystick);
        if (lookArea) containerRef.current.removeChild(lookArea);
      }
    }

    function initMaze() {
      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      // Minimap setup
      if (minimapRef.current) {
        minimapRef.current.width = 200;
        minimapRef.current.height = 200;
        minimapCtx = minimapRef.current.getContext('2d');
      }

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const wallHeight = 3;

      // Create solid walls
      walls = createSolidWalls(scene);

      // Ground Material
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x303030,
        roughness: 0.8,
        metalness: 0.2
      });

      // Ground
      const groundGeometry = new THREE.PlaneGeometry(mazeSize * 2, mazeSize * 2);
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      // Find free spaces
      const freeSpaces: {x: number, z: number}[] = [];
      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[z][x] === 0) {
            freeSpaces.push({x, z});
          }
        }
      }

      // Goal
      const goalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const goalMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        emissive: 0xFFD700,
        emissiveIntensity: 0.5
      });
      goal = new THREE.Mesh(goalGeometry, goalMaterial);

      // Spawn and Goal Placement
      const spawnPoint = freeSpaces[0];
      const goalPoint = freeSpaces[freeSpaces.length - 1];

      // Set initial positions - adjusted for new wall placement
      cameraHolder.position.set(
        spawnPoint.x * wallWidth - (mazeSize * wallWidth / 2),
        1.6,
        spawnPoint.z * wallWidth - (mazeSize * wallWidth / 2)
      );
      scene.add(cameraHolder);

      goal.position.set(
        goalPoint.x * wallWidth - (mazeSize * wallWidth / 2),
        1,
        goalPoint.z * wallWidth - (mazeSize * wallWidth / 2)
      );
      scene.add(goal);

      // Collision detection
      function checkCollision(position: THREE.Vector3) {
        const playerRadius = 0.3;
        return walls.some(wall => {
          const distance = position.distanceTo(wall.position);
          return distance < (playerRadius + 0.5);
        });
      }

      // Track player path
      function trackPlayerPath() {
        if (!minimapCtx) return;
      
        // Calculate cell size dynamically based on maze size
        const canvasSize = 200;
        const cellSize = Math.floor(canvasSize / mazeSize);
      
        // Get player's grid position - adjusted for new wall placement
        const gridX = Math.floor((cameraHolder.position.x + mazeSize * wallWidth / 2) / wallWidth);
        const gridZ = Math.floor((cameraHolder.position.z + mazeSize * wallWidth / 2) / wallWidth);
        
        // Only mark cell as visited if it's a valid path (not a wall)
        const cellKey = `${gridX},${gridZ}`;
        if (gridX >= 0 && gridX < mazeSize && gridZ >= 0 && gridZ < mazeSize && maze[gridZ][gridX] === 0) {
          visitedCells.add(cellKey);
        }
      
        // Clear minimap
        minimapCtx.clearRect(0, 0, canvasSize, canvasSize);
      
        // Draw maze on minimap
        minimapCtx.fillStyle = 'black';
        for (let z = 0; z < mazeSize; z++) {
          for (let x = 0; x < mazeSize; x++) {
            if (maze[z][x] === 1) {
              minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
            }
          }
        }
      
        // Draw visited path - only on valid path cells
        minimapCtx.fillStyle = 'green';
        visitedCells.forEach(cell => {
          const [x, z] = cell.split(',').map(Number);
          // Double-check that this is a path cell, not a wall
          if (x >= 0 && x < mazeSize && z >= 0 && z < mazeSize && maze[z][x] === 0) {
            minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
          }
        });
      
        // Draw player position
        minimapCtx.fillStyle = 'red';
        minimapCtx.beginPath();
        minimapCtx.arc(
          gridX * cellSize + cellSize / 2,
          gridZ * cellSize + cellSize / 2,
          cellSize / 3,
          0,
          Math.PI * 2
        );
        minimapCtx.fill();
      }

      // Keyboard Controls
      function handleKeyDown(event: KeyboardEvent) {
        switch(event.key.toLowerCase()) {
          case 'w':
            inputState.keyboard.moveForward = true;
            break;
          case 's':
            inputState.keyboard.moveBackward = true;
            break;
          case 'a':
            inputState.keyboard.moveLeft = true;
            break;
          case 'd':
            inputState.keyboard.moveRight = true;
            break;
        }
      }

      function handleKeyUp(event: KeyboardEvent) {
        switch(event.key.toLowerCase()) {
          case 'w':
            inputState.keyboard.moveForward = false;
            break;
          case 's':
            inputState.keyboard.moveBackward = false;
            break;
          case 'a':
            inputState.keyboard.moveLeft = false;
            break;
          case 'd':
            inputState.keyboard.moveRight = false;
            break;
        }
      }

      // Mouse Look
      function handleMouseMove(event: MouseEvent) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        // Horizontal rotation (Yaw)
        cameraHolder.rotation.y -= movementX * 0.002;

        // Vertical rotation (Pitch)
        camera.rotation.x -= movementY * 0.002;

        // Clamp pitch to prevent over-rotation
        camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
      }

      // Animation Loop with consistent movement speed
      function animate(currentTime: number) {
        animationFrameId = requestAnimationFrame(animate);
        
        // Calculate delta time for smooth movement
        if (!lastFrameTime) lastFrameTime = currentTime;
        const deltaTime = (currentTime - lastFrameTime) / 1000; // in seconds
        lastFrameTime = currentTime;
        
        // Skip if delta time is too large (e.g., after tab switch)
        if (deltaTime > 0.1) return;
        
        // Calculate movement based on deltaTime for consistent speed
        const frameSpeed = moveSpeed * deltaTime;

        // Direction vector based on camera orientation
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(cameraHolder.quaternion);
        forward.y = 0;
        forward.normalize();

        // Right vector (perpendicular to forward)
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(cameraHolder.quaternion);
        right.normalize();

        // Movement vector - starts at zero, accumulate direction
        const movement = new THREE.Vector3(0, 0, 0);

        // Add keyboard input
        if (inputState.keyboard.moveForward) movement.add(forward.clone().multiplyScalar(frameSpeed));
        if (inputState.keyboard.moveBackward) movement.add(forward.clone().multiplyScalar(-frameSpeed));
        if (inputState.keyboard.moveLeft) movement.add(right.clone().multiplyScalar(-frameSpeed));
        if (inputState.keyboard.moveRight) movement.add(right.clone().multiplyScalar(frameSpeed));

        // Add touch input if enabled
        if (mobileControlsEnabled) {
          if (inputState.touch.moveForward) movement.add(forward.clone().multiplyScalar(frameSpeed));
          if (inputState.touch.moveBackward) movement.add(forward.clone().multiplyScalar(-frameSpeed));
          if (inputState.touch.moveLeft) movement.add(right.clone().multiplyScalar(-frameSpeed));
          if (inputState.touch.moveRight) movement.add(right.clone().multiplyScalar(frameSpeed));
        }

        // Only check collision and move if we're actually moving
        if (movement.length() > 0) {
          // Check collision before moving
          const newPosition = cameraHolder.position.clone().add(movement);
          if (!checkCollision(newPosition)) {
            cameraHolder.position.copy(newPosition);
          } else {
            // Handle collision by trying to slide along walls
            // Try X movement only
            const xMovement = new THREE.Vector3(movement.x, 0, 0);
            const xPosition = cameraHolder.position.clone().add(xMovement);
            if (!checkCollision(xPosition)) {
              cameraHolder.position.copy(xPosition);
            }
            
            // Try Z movement only
            const zMovement = new THREE.Vector3(0, 0, movement.z);
            const zPosition = cameraHolder.position.clone().add(zMovement);
            if (!checkCollision(zPosition)) {
              cameraHolder.position.copy(zPosition);
            }
          }
        }

        // Update minimap
        trackPlayerPath();

        // Goal check
        if (cameraHolder.position.distanceTo(goal.position) < 1) {
          setGameStatus("Goal Reached!");
          window.location.href = "/";
        }

        renderer.render(scene, camera);
      }

      // Pointer Lock
      function requestPointerLock() {
        renderer.domElement.requestPointerLock();
      }

      // Event Listeners
      renderer.domElement.addEventListener('click', requestPointerLock);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      document.addEventListener('mousemove', handleMouseMove);

      // Start animation with time parameter
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);

      // Return cleanup function
      return () => {
        cancelAnimationFrame(animationFrameId);
        renderer.domElement.removeEventListener('click', requestPointerLock);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('mousemove', handleMouseMove);
        removeExistingTouchControls();
        
        // Dispose of Three.js resources
        if (renderer) {
          renderer.dispose();
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
        }
      };
    }

    // Initialize maze
    cleanupFunction = initMaze();
    
    // Add or remove touch controls based on mobile controls state
    if (mobileControlsEnabled && containerRef.current) {
      createTouchControls(containerRef.current);
    } else {
      removeExistingTouchControls();
    }

    // Window resize handler
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      if (cleanupFunction) cleanupFunction();
      window.removeEventListener('resize', handleResize);
      unlockScreenOrientation();
      
      // Remove any remaining styles
      const touchControlsStyle = document.getElementById('touch-controls-style');
      if (touchControlsStyle) {
        touchControlsStyle.remove();
      }
    };
  }, [mobileControlsEnabled]); // Re-run effect when mobile controls toggle changes

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
      
      {/* Mobile Controls Toggle Switch */}
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
      
      {/* Conditional mobile instructions */}
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