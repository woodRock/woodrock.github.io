import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "npm:three";

interface TouchControls {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  moveTouchId: number | null;
  lookTouchId: number | null;
  lastLookTouch: { x: number; y: number } | null;
}

enum PowerUpType {
  PATHFINDER = "pathfinder",
  SPEED_BOOST = "speedBoost",
}

interface PowerUp {
  type: PowerUpType;
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  active: boolean;
  collected: boolean;
}

export default function MazeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState("Loading...");
  const [mobileControlsEnabled, setMobileControlsEnabled] = useState(false);
  const mobileControlsEnabledRef = useRef(mobileControlsEnabled); // Ref to track latest state
  const [pathfinderActive, setPathfinderActive] = useState(false);
  const [pathfinderTimeLeft, setPathfinderTimeLeft] = useState(0);
  const [speedBoostActive, setSpeedBoostActive] = useState(false);
  const [speedBoostTimeLeft, setSpeedBoostTimeLeft] = useState(0);

  // Ref to track pathfinderActive immediately
  const pathfinderActiveRef = useRef(pathfinderActive);

  // Define inputState as a useRef to share across useEffect hooks
  const inputState = useRef<{
    keyboard: {
      moveForward: boolean;
      moveBackward: boolean;
      moveLeft: boolean;
      moveRight: boolean;
    };
    touch: {
      moveForward: boolean;
      moveBackward: boolean;
      moveLeft: boolean;
      moveRight: boolean;
      moveTouchId: number | null;
      lookTouchId: number | null;
      lastLookTouch: { x: number; y: number } | null;
    };
  }>({
    keyboard: {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    },
    touch: {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      moveTouchId: null,
      lookTouchId: null,
      lastLookTouch: null,
    },
  });

  const gameStateRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    cameraHolder: THREE.Object3D | null;
    renderer: THREE.WebGLRenderer | null;
    walls: THREE.Mesh[];
    goal: THREE.Mesh | null;
    powerUps: PowerUp[];
    pathfinderTimer: number | null;
    speedBoostTimer: number | null;
    currentMoveSpeed: number;
    pathPoints: { x: number; z: number }[];
    visitedCells: Set<string>;
    maze: number[][];
    animationFrameId: number | null;
  }>({
    scene: null,
    camera: null,
    cameraHolder: null,
    renderer: null,
    walls: [],
    goal: null,
    powerUps: [],
    pathfinderTimer: null,
    speedBoostTimer: null,
    currentMoveSpeed: 5.0,
    pathPoints: [],
    visitedCells: new Set(),
    maze: [],
    animationFrameId: null,
  });

  // Sync pathfinderActiveRef with pathfinderActive
  useEffect(() => {
    pathfinderActiveRef.current = pathfinderActive;
    if (pathfinderActive) {
      updatePathfinder();
    }
  }, [pathfinderActive]);

  // Sync mobileControlsEnabledRef with mobileControlsEnabled
  useEffect(() => {
    mobileControlsEnabledRef.current = mobileControlsEnabled;
    console.log("mobileControlsEnabled updated:", mobileControlsEnabled);
  }, [mobileControlsEnabled]);

  const lockScreenOrientation = () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch((err) =>
          console.warn("Unable to lock screen orientation:", err)
        );
      }
    } catch (error) {
      console.warn("Screen orientation API not supported");
    }
  };

  const unlockScreenOrientation = () => {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (error) {
      console.warn("Error unlocking screen orientation:", error);
    }
  };

  const toggleMobileControls = () => {
    const newState = !mobileControlsEnabled;
    setMobileControlsEnabled(newState);
    console.log("Mobile controls toggled:", newState);
    if (newState) lockScreenOrientation();
    else unlockScreenOrientation();
  };

  useEffect(() => {
    const mazeSize = 30;
    const wallWidth = 1;
    const normalMoveSpeed = 5.0;
    const boostedMoveSpeed = 10.0;

    let lastFrameTime = 0;

    function generateMaze(width: number, height: number): number[][] {
      const maze: number[][] = Array.from({ length: height }, () => Array(width).fill(1));
      for (let x = 0; x < width; x++) {
        maze[0][x] = 1;
        maze[height - 1][x] = 1;
      }
      for (let y = 0; y < height; y++) {
        maze[y][0] = 1;
        maze[y][width - 1] = 1;
      }

      function carvePassages(x: number, y: number) {
        const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]].sort(() => Math.random() - 0.5);
        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
            maze[y + dy / 2][x + dx / 2] = 0;
            maze[ny][nx] = 0;
            carvePassages(nx, ny);
          }
        }
      }

      const startX = 2 * Math.floor(Math.random() * ((width - 2) / 2)) + 1;
      const startY = 2 * Math.floor(Math.random() * ((height - 2) / 2)) + 1;
      maze[startY][startX] = 0;
      carvePassages(startX, startY);
      maze[1][1] = 0;
      maze[height - 2][width - 2] = 0;
      return maze;
    }

    function createSolidWalls(scene: THREE.Scene) {
      const wallHeight = 3;
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.7,
        metalness: 0.3,
      });
      const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallWidth);
      const walls: THREE.Mesh[] = [];

      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (gameStateRef.current.maze[z][x] === 1) {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
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

    function createPowerUps(scene: THREE.Scene, freeSpaces: { x: number; z: number }[]) {
      if (freeSpaces.length < 4) return [];

      const pathfinderGeometry = new THREE.OctahedronGeometry(0.4, 1);
      const pathfinderMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFC107,
        emissive: 0xFFC107,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      });

      const speedBoostGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
      const speedBoostMaterial = new THREE.MeshStandardMaterial({
        color: 0x4FC3F7,
        emissive: 0x4FC3F7,
        emissiveIntensity: 0.7,
        metalness: 0.7,
        roughness: 0.3,
      });

      const powerUps: PowerUp[] = [];

      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * freeSpaces.length);
        const space = freeSpaces.splice(randomIndex, 1)[0];
        const mesh = new THREE.Mesh(pathfinderGeometry, pathfinderMaterial);
        mesh.position.set(
          space.x * wallWidth - (mazeSize * wallWidth / 2),
          1,
          space.z * wallWidth - (mazeSize * wallWidth / 2)
        );
        scene.add(mesh);
        powerUps.push({
          type: PowerUpType.PATHFINDER,
          position: mesh.position.clone(),
          mesh,
          active: false,
          collected: false,
        });
      }

      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * freeSpaces.length);
        const space = freeSpaces.splice(randomIndex, 1)[0];
        const mesh = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial);
        mesh.rotation.x = Math.PI;
        mesh.position.set(
          space.x * wallWidth - (mazeSize * wallWidth / 2),
          1,
          space.z * wallWidth - (mazeSize * wallWidth / 2)
        );
        scene.add(mesh);
        powerUps.push({
          type: PowerUpType.SPEED_BOOST,
          position: mesh.position.clone(),
          mesh,
          active: false,
          collected: false,
        });
      }

      return powerUps;
    }

    function findPathAStar(start: { x: number; z: number }, end: { x: number; z: number }) {
      interface Node {
        x: number;
        z: number;
        f: number;
        g: number;
        h: number;
        parent: Node | null;
      }

      if (!gameStateRef.current.maze || gameStateRef.current.maze.length === 0) {
        console.error("Maze data is invalid or not initialized");
        return [];
      }

      if (
        start.x < 0 ||
        start.x >= mazeSize ||
        start.z < 0 ||
        start.z >= mazeSize ||
        end.x < 0 ||
        end.x >= mazeSize ||
        end.z < 0 ||
        end.z >= mazeSize ||
        gameStateRef.current.maze[start.z][start.x] === 1 ||
        gameStateRef.current.maze[end.z][end.x] === 1
      ) {
        console.error("Invalid start or end position:", {
          start,
          end,
          startCell: gameStateRef.current.maze[start.z]?.[start.x],
          endCell: gameStateRef.current.maze[end.z]?.[end.x],
        });
        return [];
      }

      console.log("A* searching from", start, "to", end);

      const openSet: Node[] = [];
      const closedSet: Set<string> = new Set();

      const startNode: Node = { x: start.x, z: start.z, f: 0, g: 0, h: 0, parent: null };
      const heuristic = (a: { x: number; z: number }, b: { x: number; z: number }) =>
        Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
      startNode.h = heuristic(startNode, end);
      startNode.f = startNode.h;
      openSet.push(startNode);

      while (openSet.length > 0) {
        let currentIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
          if (openSet[i].f < openSet[currentIndex].f) currentIndex = i;
        }

        const current = openSet[currentIndex];
        if (current.x === end.x && current.z === end.z) {
          const path: { x: number; z: number }[] = [];
          let temp: Node | null = current;
          while (temp !== null) {
            path.push({ x: temp.x, z: temp.z });
            temp = temp.parent;
          }
          console.log("Path found:", path.reverse());
          return path.reverse();
        }

        openSet.splice(currentIndex, 1);
        closedSet.add(`${current.x},${current.z}`);

        const directions = [
          { x: 0, z: 1 },
          { x: 1, z: 0 },
          { x: 0, z: -1 },
          { x: -1, z: 0 },
        ];

        for (const dir of directions) {
          const neighbor = { x: current.x + dir.x, z: current.z + dir.z };
          if (
            neighbor.x < 0 ||
            neighbor.z < 0 ||
            neighbor.x >= mazeSize ||
            neighbor.z >= mazeSize ||
            gameStateRef.current.maze[neighbor.z][neighbor.x] === 1
          ) {
            continue;
          }

          if (closedSet.has(`${neighbor.x},${neighbor.z}`)) continue;

          const gScore = current.g + 1;
          let neighborNode = openSet.find((n) => n.x === neighbor.x && n.z === neighbor.z);

          if (!neighborNode) {
            neighborNode = {
              x: neighbor.x,
              z: neighbor.z,
              g: gScore,
              h: heuristic(neighbor, end),
              f: 0,
              parent: current,
            };
            neighborNode.f = neighborNode.g + neighborNode.h;
            openSet.push(neighborNode);
          } else if (gScore < neighborNode.g) {
            neighborNode.g = gScore;
            neighborNode.f = neighborNode.g + neighborNode.h;
            neighborNode.parent = current;
          }
        }
      }

      console.warn("No path found from", start, "to", end);
      return [];
    }

    function updatePathfinder() {
      if (!pathfinderActiveRef.current || !gameStateRef.current.cameraHolder || !gameStateRef.current.goal) {
        console.warn("Pathfinder update skipped: missing dependencies", {
          pathfinderActive: pathfinderActiveRef.current,
          cameraHolder: !!gameStateRef.current.cameraHolder,
          goal: !!gameStateRef.current.goal,
        });
        return;
      }

      const playerGridX = Math.floor(
        (gameStateRef.current.cameraHolder.position.x + mazeSize * wallWidth / 2) / wallWidth
      );
      const playerGridZ = Math.floor(
        (gameStateRef.current.cameraHolder.position.z + mazeSize * wallWidth / 2) / wallWidth
      );
      const goalGridX = Math.floor(
        (gameStateRef.current.goal.position.x + mazeSize * wallWidth / 2) / wallWidth
      );
      const goalGridZ = Math.floor(
        (gameStateRef.current.goal.position.z + mazeSize * wallWidth / 2) / wallWidth
      );

      const clampedPlayerX = Math.max(0, Math.min(mazeSize - 1, playerGridX));
      const clampedPlayerZ = Math.max(0, Math.min(mazeSize - 1, playerGridZ));
      const clampedGoalX = Math.max(0, Math.min(mazeSize - 1, goalGridX));
      const clampedGoalZ = Math.max(0, Math.min(mazeSize - 1, goalGridZ));

      console.log("Updating pathfinder:", {
        playerGridX: clampedPlayerX,
        playerGridZ: clampedPlayerZ,
        goalGridX: clampedGoalX,
        goalGridZ: clampedGoalZ,
      });

      gameStateRef.current.pathPoints = findPathAStar(
        { x: clampedPlayerX, z: clampedPlayerZ },
        { x: clampedGoalX, z: clampedGoalZ }
      );

      console.log("Path points updated:", gameStateRef.current.pathPoints);
    }

    function activatePathfinder() {
      console.log("Activating pathfinder power-up");
      if (gameStateRef.current.pathfinderTimer !== null) {
        clearInterval(gameStateRef.current.pathfinderTimer);
      }

      setPathfinderActive(true);
      pathfinderActiveRef.current = true; // Immediate update

      // Delay updatePathfinder to ensure cameraHolder and goal are ready
      if (gameStateRef.current.cameraHolder && gameStateRef.current.goal) {
        updatePathfinder();
      } else {
        console.warn("Delayed pathfinder update: waiting for initialization");
      }

      const pathfinderDuration = 10000;
      let startTime = Date.now();

      gameStateRef.current.pathfinderTimer = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const timeLeft = Math.max(0, Math.ceil((pathfinderDuration - elapsed) / 1000));
        setPathfinderTimeLeft(timeLeft);
        setGameStatus(`Pathfinder active! ${timeLeft}s remaining`);

        if (timeLeft <= 0) {
          clearInterval(gameStateRef.current.pathfinderTimer!);
          gameStateRef.current.pathfinderTimer = null;
          setPathfinderActive(false);
          pathfinderActiveRef.current = false;
          gameStateRef.current.pathPoints = [];
          console.log("Pathfinder deactivated");
          setGameStatus("Exploring...");
        }
      }, 100);
    }

    function activateSpeedBoost() {
      if (gameStateRef.current.speedBoostTimer !== null) {
        clearInterval(gameStateRef.current.speedBoostTimer);
      }

      setSpeedBoostActive(true);
      gameStateRef.current.currentMoveSpeed = boostedMoveSpeed;

      const boostDuration = 10000;
      let startTime = Date.now();

      gameStateRef.current.speedBoostTimer = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const timeLeft = Math.max(0, Math.ceil((boostDuration - elapsed) / 1000));
        setSpeedBoostTimeLeft(timeLeft);
        setGameStatus(`Speed Boost! ${timeLeft}s remaining`);

        if (timeLeft <= 0) {
          clearInterval(gameStateRef.current.speedBoostTimer!);
          gameStateRef.current.speedBoostTimer = null;
          gameStateRef.current.currentMoveSpeed = normalMoveSpeed;
          setSpeedBoostActive(false);
          setGameStatus("Exploring...");
        }
      }, 100);
    }

    function animatePowerUps(deltaTime: number) {
      if (!gameStateRef.current.cameraHolder) return;

      for (const powerUp of gameStateRef.current.powerUps) {
        if (!powerUp.collected) {
          powerUp.mesh.rotation.y += deltaTime * 2;
          const hoverHeight = Math.sin(performance.now() * 0.002) * 0.2 + 1;
          powerUp.mesh.position.y = hoverHeight;

          const playerPos = gameStateRef.current.cameraHolder.position;
          const powerUpPos = powerUp.mesh.position;
          const distance = playerPos.distanceTo(powerUpPos);

          if (distance < 0.8) {
            collectPowerUp(powerUp);
          }
        }
      }
    }

    function collectPowerUp(powerUp: PowerUp) {
      if (powerUp.collected) return;

      powerUp.collected = true;
      powerUp.mesh.visible = false;
      powerUp.active = true;

      if (powerUp.type === PowerUpType.PATHFINDER) {
        activatePathfinder();
      } else if (powerUp.type === PowerUpType.SPEED_BOOST) {
        activateSpeedBoost();
      }
    }

    function checkCollision(currentPos: THREE.Vector3, movement: THREE.Vector3): THREE.Vector3 {
      const playerRadius = 0.2;
      const wallHalfWidth = 0.45;
      const newPos = currentPos.clone().add(movement);

      let closestCollision: { distance: number; normal: THREE.Vector3 } | null = null;

      for (const wall of gameStateRef.current.walls) {
        const wx = wall.position.x;
        const wz = wall.position.z;

        const dx = newPos.x - wx;
        const dz = newPos.z - wz;
        if (
          Math.abs(dx) < wallHalfWidth + playerRadius &&
          Math.abs(dz) < wallHalfWidth + playerRadius
        ) {
          const penetrationX = (wallHalfWidth + playerRadius) - Math.abs(dx);
          const penetrationZ = (wallHalfWidth + playerRadius) - Math.abs(dz);

          let normalX = 0;
          let normalZ = 0;
          if (penetrationX < penetrationZ) {
            normalX = dx > 0 ? 1 : -1;
          } else {
            normalZ = dz > 0 ? 1 : -1;
          }

          const distance = Math.min(penetrationX, penetrationZ);
          if (!closestCollision || distance < closestCollision.distance) {
            closestCollision = {
              distance,
              normal: new THREE.Vector3(normalX, 0, normalZ),
            };
          }
        }
      }

      if (!closestCollision) {
        return newPos;
      }

      const normal = closestCollision.normal;
      const moveDir = movement.clone().normalize();
      const slideMovement = movement.clone().sub(
        normal.clone().multiplyScalar(movement.dot(normal))
      );

      const slidePos = currentPos.clone().add(slideMovement);
      for (const wall of gameStateRef.current.walls) {
        const wx = wall.position.x;
        const wz = wall.position.z;
        if (
          Math.abs(slidePos.x - wx) < wallHalfWidth + playerRadius &&
          Math.abs(slidePos.z - wz) < wallHalfWidth + playerRadius
        ) {
          return currentPos.clone();
        }
      }

      return slidePos;
    }

    function initMaze() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);

      const cameraHolder = new THREE.Object3D();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraHolder.add(camera);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (containerRef.current) containerRef.current.appendChild(renderer.domElement);

      let minimapCtx: CanvasRenderingContext2D | null = null;
      if (minimapRef.current) {
        minimapRef.current.width = 200;
        minimapRef.current.height = 200;
        minimapCtx = minimapRef.current.getContext("2d");
        console.log("Minimap canvas initialized:", !!minimapCtx);
      } else {
        console.error("Minimap canvas ref is null");
      }

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      gameStateRef.current.scene = scene;
      gameStateRef.current.camera = camera;
      gameStateRef.current.cameraHolder = cameraHolder;
      gameStateRef.current.renderer = renderer;
      gameStateRef.current.maze = generateMaze(mazeSize, mazeSize);
      console.log("Maze initialized:", gameStateRef.current.maze);
      gameStateRef.current.walls = createSolidWalls(scene);

      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x303030,
        roughness: 0.8,
        metalness: 0.2,
      });
      const groundGeometry = new THREE.PlaneGeometry(mazeSize * 2, mazeSize * 2);
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      const freeSpaces: { x: number; z: number }[] = [];
      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (gameStateRef.current.maze[z][x] === 0) freeSpaces.push({ x, z });
        }
      }

      const goalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const goalMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        emissive: 0xFFD700,
        emissiveIntensity: 0.5,
      });
      const goal = new THREE.Mesh(goalGeometry, goalMaterial);

      const spawnPoint = freeSpaces.find(p => gameStateRef.current.maze[p.z][p.x] === 0) || freeSpaces[0];
      const goalPoint = freeSpaces[freeSpaces.length - 2];
      console.log("Spawn point:", spawnPoint, "Goal point:", goalPoint);

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
      gameStateRef.current.goal = goal;

      const powerUpSpaces = [...freeSpaces];
      powerUpSpaces.splice(0, 1);
      powerUpSpaces.splice(powerUpSpaces.length - 1, 1);
      gameStateRef.current.powerUps = createPowerUps(scene, powerUpSpaces);

      const animate = (currentTime: number) => {
        gameStateRef.current.animationFrameId = requestAnimationFrame(animate);

        if (!lastFrameTime) lastFrameTime = currentTime;
        const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
        lastFrameTime = currentTime;

        animatePowerUps(deltaTime);

        const maxStepSize = 0.1;
        const frameSpeed = Math.min(gameStateRef.current.currentMoveSpeed * deltaTime, maxStepSize);
        const forward = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(cameraHolder.quaternion)
          .setY(0)
          .normalize();
        const right = new THREE.Vector3(1, 0, 0)
          .applyQuaternion(cameraHolder.quaternion)
          .normalize();

        console.log("Animate tick:", {
          mobileControlsEnabled: mobileControlsEnabledRef.current,
          touchInput: inputState.current.touch,
          keyboardInput: inputState.current.keyboard,
          frameSpeed,
        });

        const movement = new THREE.Vector3(0, 0, 0);
        if (
          inputState.current.keyboard.moveForward ||
          (mobileControlsEnabledRef.current && inputState.current.touch.moveForward)
        ) {
          movement.add(forward.clone().multiplyScalar(frameSpeed));
        }
        if (
          inputState.current.keyboard.moveBackward ||
          (mobileControlsEnabledRef.current && inputState.current.touch.moveBackward)
        ) {
          movement.add(forward.clone().multiplyScalar(-frameSpeed));
        }
        if (
          inputState.current.keyboard.moveLeft ||
          (mobileControlsEnabledRef.current && inputState.current.touch.moveLeft)
        ) {
          movement.add(right.clone().multiplyScalar(-frameSpeed));
        }
        if (
          inputState.current.keyboard.moveRight ||
          (mobileControlsEnabledRef.current && inputState.current.touch.moveRight)
        ) {
          movement.add(right.clone().multiplyScalar(frameSpeed));
        }

        if (movement.length() > 0) {
          console.log("Movement computed:", {
            movement: movement.toArray(),
            currentPos: cameraHolder.position.toArray(),
          });
          const newPosition = checkCollision(cameraHolder.position, movement);
          console.log("New position after collision:", {
            newPosition: newPosition.toArray(),
            changed: !newPosition.equals(cameraHolder.position),
          });
          cameraHolder.position.copy(newPosition);
        }

        trackPlayerPath();

        if (cameraHolder.position.distanceTo(goal.position) < 1) {
          setGameStatus("Goal Reached!");
          window.location.href = "/";
        }

        renderer.render(scene, camera);
      };

      function trackPlayerPath() {
        if (!minimapCtx || !gameStateRef.current.goal) {
          console.error("Minimap context or goal is null");
          return;
        }

        const canvasSize = 200;
        const cellSize = Math.floor(canvasSize / mazeSize);

        const gridX = Math.floor(
          (cameraHolder.position.x + mazeSize * wallWidth / 2) / wallWidth
        );
        const gridZ = Math.floor(
          (cameraHolder.position.z + mazeSize * wallWidth / 2) / wallWidth
        );
        const exactX = (cameraHolder.position.x + mazeSize * wallWidth / 2) / wallWidth;
        const exactZ = (cameraHolder.position.z + mazeSize * wallWidth / 2) / wallWidth;

        const cellKey = `${gridX},${gridZ}`;
        if (
          gridX >= 0 &&
          gridX < mazeSize &&
          gridZ >= 0 &&
          gridZ < mazeSize &&
          gameStateRef.current.maze[gridZ][gridX] === 0
        ) {
          gameStateRef.current.visitedCells.add(cellKey);
        }

        minimapCtx.clearRect(0, 0, canvasSize, canvasSize);

        minimapCtx.fillStyle = "black";
        for (let z = 0; z < mazeSize; z++) {
          for (let x = 0; x < mazeSize; x++) {
            if (gameStateRef.current.maze[z][x] === 1)
              minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
          }
        }

        if (pathfinderActiveRef.current && gameStateRef.current.pathPoints.length > 0) {
          console.log("Attempting to draw path:", gameStateRef.current.pathPoints, "Player position:", { exactX, exactZ });
          minimapCtx.strokeStyle = "#FF4081";
          minimapCtx.lineWidth = 3;
          minimapCtx.setLineDash([5, 3]);
          minimapCtx.beginPath();
          minimapCtx.moveTo(exactX * cellSize, exactZ * cellSize);
          for (let i = 0; i < gameStateRef.current.pathPoints.length; i++) {
            const point = gameStateRef.current.pathPoints[i];
            const pathX = point.x * cellSize + cellSize / 2;
            const pathZ = point.z * cellSize + cellSize / 2;
            minimapCtx.lineTo(pathX, pathZ);
          }
          const dashOffset = (performance.now() / 100) % 8;
          minimapCtx.lineDashOffset = -dashOffset;
          minimapCtx.globalAlpha = 1.0;
          minimapCtx.stroke();
          minimapCtx.setLineDash([]);
          minimapCtx.globalAlpha = 1.0;
        }

        minimapCtx.fillStyle = "green";
        gameStateRef.current.visitedCells.forEach((cell) => {
          const [x, z] = cell.split(",").map(Number);
          if (
            x >= 0 &&
            x < mazeSize &&
            z >= 0 &&
            z < mazeSize &&
            gameStateRef.current.maze[z][x] === 0
          ) {
            minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
          }
        });

        gameStateRef.current.powerUps.forEach((powerUp) => {
          if (!powerUp.collected) {
            const powerUpX = Math.floor(
              (powerUp.position.x + mazeSize * wallWidth / 2) / wallWidth
            );
            const powerUpZ = Math.floor(
              (powerUp.position.z + mazeSize * wallWidth / 2) / wallWidth
            );
            minimapCtx.fillStyle =
              powerUp.type === PowerUpType.PATHFINDER ? "yellow" : "cyan";
            minimapCtx.beginPath();
            minimapCtx.arc(powerUpX * cellSize + cellSize / 2, powerUpZ * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
            minimapCtx.fill();
          }
        });

        const goalX = Math.floor(
          (gameStateRef.current.goal.position.x + mazeSize * wallWidth / 2) / wallWidth
        );
        const goalZ = Math.floor(
          (gameStateRef.current.goal.position.z + mazeSize * wallWidth / 2) / wallWidth
        );
        minimapCtx.fillStyle = "gold";
        minimapCtx.beginPath();
        minimapCtx.arc(goalX * cellSize + cellSize / 2, goalZ * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
        minimapCtx.fill();

        minimapCtx.fillStyle = "red";
        minimapCtx.beginPath();
        const clampedX = Math.max(0, Math.min(mazeSize - 1, exactX));
        const clampedZ = Math.max(0, Math.min(mazeSize - 1, exactZ));
        minimapCtx.arc(clampedX * cellSize, clampedZ * cellSize, cellSize / 3, 0, Math.PI * 2);
        minimapCtx.fill();
      }

      function handleKeyDown(event: KeyboardEvent) {
        switch (event.key.toLowerCase()) {
          case "w":
            inputState.current.keyboard.moveForward = true;
            break;
          case "s":
            inputState.current.keyboard.moveBackward = true;
            break;
          case "a":
            inputState.current.keyboard.moveLeft = true;
            break;
          case "d":
            inputState.current.keyboard.moveRight = true;
            break;
        }
      }

      function handleKeyUp(event: KeyboardEvent) {
        switch (event.key.toLowerCase()) {
          case "w":
            inputState.current.keyboard.moveForward = false;
            break;
          case "s":
            inputState.current.keyboard.moveBackward = false;
            break;
          case "a":
            inputState.current.keyboard.moveLeft = false;
            break;
          case "d":
            inputState.current.keyboard.moveRight = false;
            break;
        }
      }

      function handleMouseMove(event: MouseEvent) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
        cameraHolder.rotation.y -= movementX * 0.002;
        camera.rotation.x -= movementY * 0.002;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      }

      function requestPointerLock() {
        renderer.domElement.requestPointerLock();
      }

      renderer.domElement.addEventListener("click", requestPointerLock);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      document.addEventListener("mousemove", handleMouseMove);

      lastFrameTime = performance.now();
      gameStateRef.current.animationFrameId = requestAnimationFrame(animate);
      setGameStatus("Find the goal! Look for power-ups to help you.");
    }

    if (!gameStateRef.current.scene) {
      initMaze();
    }

    const handleResize = () => {
      if (gameStateRef.current.camera && gameStateRef.current.renderer) {
        gameStateRef.current.camera.aspect = window.innerWidth / window.innerHeight;
        gameStateRef.current.camera.updateProjectionMatrix();
        gameStateRef.current.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (gameStateRef.current.animationFrameId) {
        cancelAnimationFrame(gameStateRef.current.animationFrameId);
      }
      if (gameStateRef.current.renderer) {
        gameStateRef.current.renderer.domElement.removeEventListener("click", requestPointerLock);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (gameStateRef.current.speedBoostTimer !== null) {
        clearInterval(gameStateRef.current.speedBoostTimer);
      }
      if (gameStateRef.current.pathfinderTimer !== null) {
        clearInterval(gameStateRef.current.pathfinderTimer);
      }
      if (
        gameStateRef.current.renderer &&
        containerRef.current &&
        gameStateRef.current.renderer.domElement
      ) {
        containerRef.current.removeChild(gameStateRef.current.renderer.domElement);
        gameStateRef.current.renderer.dispose();
      }
      unlockScreenOrientation();
      const touchControlsStyle = document.getElementById("touch-controls-style");
      if (touchControlsStyle) touchControlsStyle.remove();
    };
  }, []);

  useEffect(() => {
    function handleMovementTouch(e: TouchEvent, joystickBg: HTMLElement, joystickKnob: HTMLElement) {
      e.preventDefault();
      const touch = Array.from(e.touches).find(
        (t) => t.identifier === inputState.current.touch.moveTouchId
      );
      if (!touch) {
        console.log("No touch found for moveTouchId:", inputState.current.touch.moveTouchId);
        return;
      }

      const rect = joystickBg.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      console.log("Movement touch detected:", { clientX: touch.clientX, clientY: touch.clientY, centerX, centerY, rect });

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), rect.width / 2);
      const angle = Math.atan2(deltaY, deltaX);

      const knobX = Math.cos(angle) * distance;
      const knobY = Math.sin(angle) * distance;
      joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
      joystickKnob.classList.add("active");

      const deadzone = 0.1;
      const normalizedDistance = distance / (rect.width / 2);

      inputState.current.touch.moveForward = false;
      inputState.current.touch.moveBackward = false;
      inputState.current.touch.moveLeft = false;
      inputState.current.touch.moveRight = false;

      if (normalizedDistance > deadzone) {
        if (angle >= -Math.PI * 0.75 && angle <= -Math.PI * 0.25) {
          inputState.current.touch.moveForward = true;
        } else if (angle >= Math.PI * 0.25 && angle <= Math.PI * 0.75) {
          inputState.current.touch.moveBackward = true;
        }
        if (angle >= -Math.PI * 0.25 && angle <= Math.PI * 0.25) {
          inputState.current.touch.moveRight = true;
        } else if (angle <= -Math.PI * 0.75 || angle >= Math.PI * 0.75) {
          inputState.current.touch.moveLeft = true;
        }
      }

      console.log("Movement state:", {
        moveForward: inputState.current.touch.moveForward,
        moveBackward: inputState.current.touch.moveBackward,
        moveLeft: inputState.current.touch.moveLeft,
        moveRight: inputState.current.touch.moveRight,
        angle,
        normalizedDistance,
      });
    }

    function resetMovementJoystick(joystickKnob: HTMLElement) {
      joystickKnob.style.transform = "translate(0, 0)";
      joystickKnob.classList.remove("active");
      inputState.current.touch.moveForward = false;
      inputState.current.touch.moveBackward = false;
      inputState.current.touch.moveLeft = false;
      inputState.current.touch.moveRight = false;
      inputState.current.touch.moveTouchId = null;
      console.log("Movement joystick reset");
    }

    function handleLookTouch(e: TouchEvent, lookArea: HTMLElement) {
      e.preventDefault();
      const touch = Array.from(e.touches).find(
        (t) => t.identifier === inputState.current.touch.lookTouchId
      );
      if (!touch || !gameStateRef.current.cameraHolder || !gameStateRef.current.camera) return;

      const rect = lookArea.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const extendedRadius = 200;

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance <= extendedRadius && inputState.current.touch.lastLookTouch) {
        const moveX = touch.clientX - inputState.current.touch.lastLookTouch.x;
        const moveY = touch.clientY - inputState.current.touch.lastLookTouch.y;
        const sensitivity = Math.min(1, distance / 120) * 0.05;
        gameStateRef.current.cameraHolder.rotation.y -= moveX * sensitivity;
        gameStateRef.current.camera.rotation.x -= moveY * sensitivity;
        gameStateRef.current.camera.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, gameStateRef.current.camera.rotation.x)
        );
      }

      inputState.current.touch.lastLookTouch = { x: touch.clientX, y: touch.clientY };
    }

    function createTouchControls(container: HTMLDivElement) {
      removeExistingTouchControls();

      const movementJoystick = document.createElement("div");
      movementJoystick.className = "joystick movement-joystick";
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

      const lookArea = document.createElement("div");
      lookArea.className = "look-area";
      lookArea.innerHTML = '<div class="look-text">LOOK</div>';
      container.appendChild(lookArea);

      const style = document.createElement("style");
      style.id = "touch-controls-style";
      style.textContent = `
        .joystick { position: absolute; width: 120px; height: 120px; z-index: 1000; user-select: none; touch-action: none; }
        .movement-joystick { bottom: 20px; left: 20px; transform: none; }
        .joystick-background { width: 100%; height: 100%; border-radius: 50%; background: rgba(255, 255, 255, 0.3); border: 2px solid red; display: flex; justify-content: center; align-items: center; }
        .joystick-knob { width: 40%; height: 40%; border-radius: 50%; background: rgba(255, 255, 255, 0.8); pointer-events: none; transform: translate(0, 0); }
        .joystick-knob.active { background: rgba(0, 255, 0, 0.8); box-shadow: 0 0 10px rgba(0, 255, 0, 0.5); }
        .joystick-arrows { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .arrow { position: absolute; color: white; font-size: 16px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
        .arrow.up { top: 10px; left: 50%; transform: translateX(-50%); }
        .arrow.right { right: 10px; top: 50%; transform: translateY(-50%); }
        .arrow.down { bottom: 10px; left: 50%; transform: translateX(-50%); }
        .arrow.left { left: 10px; top: 50%; transform: translateY(-50%); }
        .look-area { position: absolute; bottom: 20px; right: 20px; transform: none; width: 120px; height: 120px; border-radius: 50%; background: rgba(255, 255, 255, 0.3); border: 2px solid rgba(255, 255, 255, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; user-select: none; touch-action: none; }
        .look-text { color: white; font-weight: bold; font-size: 18px; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
      `;
      document.head.appendChild(style);

      const joystickBg = movementJoystick.querySelector(".joystick-background") as HTMLElement;
      const joystickKnob = movementJoystick.querySelector(".joystick-knob") as HTMLElement;

      if (!joystickBg || !joystickKnob) {
        console.error("Joystick elements missing");
        return;
      }

      const touchHandler = (e: TouchEvent) => {
        e.preventDefault();
        const touches = Array.from(e.changedTouches);
        console.log("Touch event:", e.type, "Touches:", touches.map(t => ({ id: t.identifier, x: t.clientX, y: t.clientY })));

        if (!inputState.current.touch.moveTouchId) {
          const moveTouch = touches.find((t) => {
            const rect = joystickBg.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = t.clientX - centerX;
            const dy = t.clientY - centerY;
            const isInBounds = Math.sqrt(dx * dx + dy * dy) <= 60;
            console.log("Move touch check:", {
              id: t.identifier,
              x: t.clientX,
              y: t.clientY,
              centerX,
              centerY,
              rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
              isInBounds,
            });
            return isInBounds;
          });
          if (moveTouch) {
            inputState.current.touch.moveTouchId = moveTouch.identifier;
            console.log("Set moveTouchId:", moveTouch.identifier);
          }
        }

        if (inputState.current.touch.moveTouchId !== null) {
          handleMovementTouch(e, joystickBg, joystickKnob);
        }

        if (!inputState.current.touch.lookTouchId) {
          const lookTouch = touches.find((t) => {
            const rect = lookArea.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = t.clientX - centerX;
            const dy = t.clientY - centerY;
            const isInBounds = Math.sqrt(dx * dx + dy * dy) <= 200;
            console.log("Look touch check:", {
              id: t.identifier,
              x: t.clientX,
              y: t.clientY,
              centerX,
              centerY,
              isInBounds,
            });
            return isInBounds;
          });
          if (lookTouch) {
            inputState.current.touch.lookTouchId = lookTouch.identifier;
            console.log("Set lookTouchId:", lookTouch.identifier);
          }
        }

        if (inputState.current.touch.lookTouchId !== null) {
          handleLookTouch(e, lookArea);
        }
      };

      const touchEndHandler = (e: TouchEvent) => {
        e.preventDefault();
        const remainingTouches = Array.from(e.touches);
        console.log("Touch end/cancel:", e.type, "Remaining touches:", remainingTouches.map(t => ({ id: t.identifier })));

        if (
          inputState.current.touch.moveTouchId !== null &&
          !remainingTouches.some((t) => t.identifier === inputState.current.touch.moveTouchId)
        ) {
          resetMovementJoystick(joystickKnob);
          console.log("Cleared moveTouchId:", inputState.current.touch.moveTouchId);
        }

        if (
          inputState.current.touch.lookTouchId !== null &&
          !remainingTouches.some((t) => t.identifier === inputState.current.touch.lookTouchId)
        ) {
          inputState.current.touch.lastLookTouch = null;
          inputState.current.touch.lookTouchId = null;
          console.log("Cleared lookTouchId:", inputState.current.touch.lookTouchId);
        }
      };

      container.addEventListener("touchstart", touchHandler);
      container.addEventListener("touchmove", touchHandler);
      container.addEventListener("touchend", touchEndHandler);
      container.addEventListener("touchcancel", touchEndHandler);

      return () => {
        container.removeEventListener("touchstart", touchHandler);
        container.removeEventListener("touchmove", touchHandler);
        container.removeEventListener("touchend", touchEndHandler);
        container.removeEventListener("touchcancel", touchEndHandler);
      };
    }

    function removeExistingTouchControls() {
      if (containerRef.current) {
        const joystick = containerRef.current.querySelector(".movement-joystick");
        const lookArea = containerRef.current.querySelector(".look-area");
        if (joystick) containerRef.current.removeChild(joystick);
        if (lookArea) containerRef.current.removeChild(lookArea);
      }
    }

    if (mobileControlsEnabled && containerRef.current) {
      const cleanup = createTouchControls(containerRef.current);
      return cleanup;
    } else {
      removeExistingTouchControls();
    }
  }, [mobileControlsEnabled]);

  const PowerUpIndicator = ({
    active,
    type,
    timeLeft,
  }: {
    active: boolean;
    type: "pathfinder" | "speedBoost";
    timeLeft?: number;
  }) => {
    const iconContent = type === "pathfinder" ? "★" : "⚡";
    const color = active ? (type === "pathfinder" ? "#FFC107" : "#4FC3F7") : "#444";
    const label = type === "pathfinder" ? "Pathfinder" : "Speed Boost";

    const pulsing = active && timeLeft && timeLeft <= 2;
    const pulseStyle = pulsing
      ? {
          animation: "pulse 0.5s infinite",
          animationName: "pulse",
          animationDuration: "0.5s",
          animationIterationCount: "infinite",
        }
      : {};

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
          color: active ? "white" : "#aaa",
        }}
      >
        <span
          style={{
            backgroundColor: color,
            color: "#000",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: active ? `0 0 10px ${color}` : "none",
            ...pulseStyle,
          }}
        >
          {iconContent}
        </span>
        <span>
          {label}
          {active && timeLeft && timeLeft > 0 ? ` (${timeLeft}s)` : ""}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      <canvas
        ref={minimapRef}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          border: "2px solid white",
          backgroundColor: "#888888", // Solid light gray background
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          background: "rgba(0,0,0,0.7)",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Maze Challenge</h3>
        <p style={{ margin: "5px 0" }}>WASD: Move</p>
        <p style={{ margin: "5px 0" }}>Click to look around</p>
        <p style={{ margin: "5px 0" }}>Status: {gameStatus}</p>

        <div style={{ marginTop: "10px", borderTop: "1px solid #555", paddingTop: "10px" }}>
          <h4 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>Power-ups:</h4>
          <PowerUpIndicator active={pathfinderActive} type="pathfinder" timeLeft={pathfinderTimeLeft} />
          <PowerUpIndicator active={speedBoostActive} type="speedBoost" timeLeft={speedBoostTimeLeft} />
        </div>

        <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.8 }}>
          <p style={{ margin: "5px 0" }}>★ - Pathfinder (5s)</p>
          <p style={{ margin: "5px 0" }}>⚡ - Speed Boost (10s)</p>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "220px",
          left: "10px",
          color: "white",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 15px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <span>Mobile Controls:</span>
        <label
          style={{ position: "relative", display: "inline-block", width: "40px", height: "20px", marginLeft: "10px" }}
        >
          <input
            type="checkbox"
            checked={mobileControlsEnabled}
            onChange={toggleMobileControls}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: mobileControlsEnabled ? "#2196F3" : "#ccc",
              transition: ".4s",
              borderRadius: "34px",
            }}
          >
            <span
              style={{
                position: "absolute",
                content: '""',
                height: "14px",
                width: "14px",
                left: mobileControlsEnabled ? "23px" : "3px",
                bottom: "3px",
                backgroundColor: "white",
                transition: ".4s",
                borderRadius: "50%",
              }}
            />
          </span>
        </label>
      </div>
      {mobileControlsEnabled && (
        <div
          style={{
            position: "absolute",
            top: "270px",
            left: "10px",
            color: "white",
            background: "rgba(0,0,0,0.7)",
            padding: "10px 15px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          <p>Left joystick: Move</p>
          <p>Right area: Look around</p>
        </div>
      )}
    </div>
  );
}