// islands/MazeGame.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "npm:three";

export default function MazeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState("Loading...");

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let walls: THREE.Mesh[] = [];
    let goal: THREE.Mesh;
    let minimapCtx: CanvasRenderingContext2D | null = null;

    // Tracking player path
    const visitedCells = new Set<string>();
    const mazeSize = 30;
    const wallWidth = 1;

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
    const moveDirection = new THREE.Vector3();
    const moveSpeed = 0.3;
    const keys: {[key: string]: boolean} = {};

    // Maze generation
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

    function createSolidWalls(scene: THREE.Scene) {
      const wallHeight = 3;
      const wallWidth = 1;

      // Wall Material
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.7,
        metalness: 0.3
      });

      // Wall Geometry
      const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallWidth);
      const walls: THREE.Mesh[] = [];

      // Create walls for every wall cell in the maze
      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[z][x] === 1) {
            // Check adjacent cells to decide wall placement
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.position.set(
              x * wallWidth * 2 - (mazeSize * wallWidth),
              wallHeight / 2,
              z * wallWidth * 2 - (mazeSize * wallWidth)
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
      const wallWidth = 1;

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

      // Set initial positions
      cameraHolder.position.set(
        spawnPoint.x * wallWidth * 2 - (mazeSize * wallWidth),
        1.6,
        spawnPoint.z * wallWidth * 2 - (mazeSize * wallWidth)
      );
      scene.add(cameraHolder);

      goal.position.set(
        goalPoint.x * wallWidth * 2 - (mazeSize * wallWidth),
        1,
        goalPoint.z * wallWidth * 2 - (mazeSize * wallWidth)
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
      
        // Get player's grid position
        const gridX = Math.floor((cameraHolder.position.x + mazeSize * wallWidth) / (wallWidth * 2));
        const gridZ = Math.floor((cameraHolder.position.z + mazeSize * wallWidth) / (wallWidth * 2));
        
        // Mark cell as visited
        const cellKey = `${gridX},${gridZ}`;
        visitedCells.add(cellKey);
      
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
      
        // Draw visited path
        minimapCtx.fillStyle = 'green';
        visitedCells.forEach(cell => {
          const [x, z] = cell.split(',').map(Number);
          minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
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
        keys[event.key.toLowerCase()] = true;
      }

      function handleKeyUp(event: KeyboardEvent) {
        keys[event.key.toLowerCase()] = false;
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

      // Animation Loop
      function animate() {
        requestAnimationFrame(animate);

        // Reset move direction
        moveDirection.set(0, 0, 0);

        // Get camera's world direction
        camera.getWorldDirection(moveDirection);
        moveDirection.y = 0;
        moveDirection.normalize();

        // Sideways movement
        const sideways = new THREE.Vector3(-moveDirection.z, 0, moveDirection.x);

        // Movement based on keys
        if (keys['w']) {
          const newPosition = cameraHolder.position.clone().add(moveDirection.multiplyScalar(moveSpeed));
          if (!checkCollision(newPosition)) {
            cameraHolder.position.add(moveDirection.multiplyScalar(moveSpeed));
          }
        }
        if (keys['s']) {
          const newPosition = cameraHolder.position.clone().sub(moveDirection.multiplyScalar(moveSpeed));
          if (!checkCollision(newPosition)) {
            cameraHolder.position.sub(moveDirection.multiplyScalar(moveSpeed));
          }
        }
        if (keys['a']) {
          const newPosition = cameraHolder.position.clone().sub(sideways.multiplyScalar(moveSpeed));
          if (!checkCollision(newPosition)) {
            cameraHolder.position.sub(sideways.multiplyScalar(moveSpeed));
          }
        }
        if (keys['d']) {
          const newPosition = cameraHolder.position.clone().add(sideways.multiplyScalar(moveSpeed));
          if (!checkCollision(newPosition)) {
            cameraHolder.position.add(sideways.multiplyScalar(moveSpeed));
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

      // Start animation
      animate();

      // Cleanup
      return () => {
        renderer.domElement.removeEventListener('click', requestPointerLock);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }

    // Initialize maze when component mounts
    const cleanup = initMaze();

    // Resize handler
    function handleResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      cleanup();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      </div>
    </div>
  );
}