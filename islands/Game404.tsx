// islands/MazeGame.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "npm:three";

interface TouchControls {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  moveTouchId: number | null; // Track movement touch
  lookTouchId: number | null; // Track look touch
  lastLookTouch: { x: number; y: number } | nullMEL;
}

export default function MazeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState("Loading...");
  const [mobileControlsEnabled, setMobileControlsEnabled] = useState(false);

  const lockScreenOrientation = () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(err => console.warn("Unable to lock screen orientation:", err));
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
    if (newState) lockScreenOrientation();
    else unlockScreenOrientation();
  };

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let walls: THREE.Mesh[] = [];
    let goal: THREE.Mesh;
    let minimapCtx: CanvasRenderingContext2D | null = null;
    let cleanupFunction: (() => void) | null = null;
    let animationFrameId: number;
    let lastFrameTime = 0;

    const visitedCells = new Set<string>();
    const mazeSize = 30;
    const wallWidth = 1;

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
        moveTouchId: null as number | null,
        lookTouchId: null as number | null,
        lastLookTouch: null as { x: number; y: number } | null
      }
    };

    const cameraHolder = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraHolder.add(camera);

    const moveSpeed = 5.0;

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
            maze[y + dy/2][x + dx/2] = 0;
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

    const maze = generateMaze(mazeSize, mazeSize);

    function createSolidWalls(scene: THREE.Scene) {
      const wallHeight = 3;
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.7,
        metalness: 0.3
      });
      const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallWidth);
      const walls: THREE.Mesh[] = [];

      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[z][x] === 1) {
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

    function handleMovementTouch(e: TouchEvent, joystickBg: HTMLElement, joystickKnob: HTMLElement) {
      e.preventDefault();
      const touch = Array.from(e.touches).find(t => t.identifier === inputState.touch.moveTouchId);
      if (!touch) return;

      const rect = joystickBg.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), rect.width / 2);
      const angle = Math.atan2(deltaY, deltaX);

      const knobX = Math.cos(angle) * distance;
      const knobY = Math.sin(angle) * distance;
      joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;

      const deadzone = 0.3;
      const normalizedDistance = distance / (rect.width / 2);

      inputState.touch.moveForward = false;
      inputState.touch.moveBackward = false;
      inputState.touch.moveLeft = false;
      inputState.touch.moveRight = false;

      if (normalizedDistance > deadzone) {
        if (angle > -Math.PI * 0.75 && angle < -Math.PI * 0.25) inputState.touch.moveForward = true;
        else if (angle > Math.PI * 0.25 && angle < Math.PI * 0.75) inputState.touch.moveBackward = true;
        if (angle > -Math.PI * 0.25 && angle < Math.PI * 0.25) inputState.touch.moveRight = true;
        else if (Math.abs(angle) > Math.PI * 0.75) inputState.touch.moveLeft = true;
      }
    }

    function resetMovementJoystick(joystickKnob: HTMLElement) {
      joystickKnob.style.transform = 'translate(0, 0)';
      inputState.touch.moveForward = false;
      inputState.touch.moveBackward = false;
      inputState.touch.moveLeft = false;
      inputState.touch.moveRight = false;
      inputState.touch.moveTouchId = null;
    }

    function handleLookTouch(e: TouchEvent, lookArea: HTMLElement) {
      e.preventDefault();
      const touch = Array.from(e.touches).find(t => t.identifier === inputState.touch.lookTouchId);
      if (!touch) return;

      const rect = lookArea.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const extendedRadius = 200; // Wider range for look control

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance <= extendedRadius && inputState.touch.lastLookTouch) {
        const moveX = touch.clientX - inputState.touch.lastLookTouch.x;
        const moveY = touch.clientY - inputState.touch.lastLookTouch.y;
        const sensitivity = Math.min(1, distance / 120) * 0.05; // Scale sensitivity up to button edge
        cameraHolder.rotation.y -= moveX * sensitivity;
        camera.rotation.x -= moveY * sensitivity;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      }

      inputState.touch.lastLookTouch = { x: touch.clientX, y: touch.clientY };
    }

    function createTouchControls(container: HTMLDivElement) {
      removeExistingTouchControls();

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

      const lookArea = document.createElement('div');
      lookArea.className = 'look-area';
      lookArea.innerHTML = '<div class="look-text">LOOK</div>';
      container.appendChild(lookArea);

      const style = document.createElement('style');
      style.id = 'touch-controls-style';
      style.textContent = `
        .joystick { position: absolute; width: 120px; height: 120px; z-index: 100; user-select: none; touch-action: none; }
        .movement-joystick { top: 60%; left: 15%; transform: translate(-50%, -50%); }
        .joystick-background { width: 100%; height: 100%; border-radius: 50%; background: rgba(255, 255, 255, 0.3); border: 2px solid rgba(255, 255, 255, 0.5); display: flex; justify-content: center; align-items: center; }
        .joystick-knob { width: 40%; height: 40%; border-radius: 50%; background: rgba(255, 255, 255, 0.8); pointer-events: none; transform: translate(0, 0); }
        .joystick-arrows { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .arrow { position: absolute; color: white; font-size: 16px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
        .arrow.up { top: 10px; left: 50%; transform: translateX(-50%); }
        .arrow.right { right: 10px; top: 50%; transform: translateY(-50%); }
        .arrow.down { bottom: 10px; left: 50%; transform: translateX(-50%); }
        .arrow.left { left: 10px; top: 50%; transform: translateY(-50%); }
        .look-area { position: absolute; top: 60%; right: 15%; transform: translate(50%, -50%); width: 120px; height: 120px; border-radius: 50%; background: rgba(255, 255, 255, 0.3); border: 2px solid rgba(255, 255, 255, 0.5); z-index: 100; display: flex; justify-content: center; align-items: center; user-select: none; touch-action: none; }
        .look-text { color: white; font-weight: bold; font-size: 18px; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
      `;
      document.head.appendChild(style);

      const joystickBg = movementJoystick.querySelector('.joystick-background') as HTMLElement;
      const joystickKnob = movementJoystick.querySelector('.joystick-knob') as HTMLElement;

      const touchHandler = (e: TouchEvent) => {
        e.preventDefault();
        const touches = Array.from(e.touches);

        // Assign or update movement touch
        if (!inputState.touch.moveTouchId) {
          const moveTouch = touches.find(t => {
            const rect = joystickBg.getBoundingClientRect();
            return t.clientX >= rect.left && t.clientX <= rect.right && t.clientY >= rect.top && t.clientY <= rect.bottom;
          });
          if (moveTouch) inputState.touch.moveTouchId = moveTouch.identifier;
        }
        if (inputState.touch.moveTouchId !== null) {
          handleMovementTouch(e, joystickBg, joystickKnob);
        }

        // Assign or update look touch
        if (!inputState.touch.lookTouchId) {
          const lookTouch = touches.find(t => {
            const rect = lookArea.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = t.clientX - centerX;
            const dy = t.clientY - centerY;
            return Math.sqrt(dx * dx + dy * dy) <= 200; // Extended range
          });
          if (lookTouch) inputState.touch.lookTouchId = lookTouch.identifier;
        }
        if (inputState.touch.lookTouchId !== null) {
          handleLookTouch(e, lookArea);
        }
      };

      const touchEndHandler = (e: TouchEvent) => {
        e.preventDefault();
        const remainingTouches = Array.from(e.touches);

        if (!remainingTouches.some(t => t.identifier === inputState.touch.moveTouchId)) {
          resetMovementJoystick(joystickKnob);
        }
        if (!remainingTouches.some(t => t.identifier === inputState.touch.lookTouchId)) {
          inputState.touch.lastLookTouch = null;
          inputState.touch.lookTouchId = null;
        }
      };

      container.addEventListener('touchstart', touchHandler);
      container.addEventListener('touchmove', touchHandler);
      container.addEventListener('touchend', touchEndHandler);
      container.addEventListener('touchcancel', touchEndHandler);
    }

    function removeExistingTouchControls() {
      if (containerRef.current) {
        const joystick = containerRef.current.querySelector('.movement-joystick');
        const lookArea = containerRef.current.querySelector('.look-area');
        if (joystick) containerRef.current.removeChild(joystick);
        if (lookArea) containerRef.current.removeChild(lookArea);
      }
    }

    function checkCollision(currentPos: THREE.Vector3, movement: THREE.Vector3): THREE.Vector3 {
      const playerRadius = 0.3;
      const wallHalfWidth = wallWidth / 2;

      const newPos = currentPos.clone().add(movement);
      const testX = new THREE.Vector3(newPos.x, currentPos.y, currentPos.z);
      const testZ = new THREE.Vector3(currentPos.x, currentPos.y, newPos.z);

      let collidesX = false;
      let collidesZ = false;

      for (const wall of walls) {
        const wx = wall.position.x;
        const wz = wall.position.z;
        if (
          Math.abs(testX.x - wx) < wallHalfWidth + playerRadius &&
          Math.abs(testX.z - wz) < wallHalfWidth + playerRadius
        ) collidesX = true;
        if (
          Math.abs(testZ.x - wx) < wallHalfWidth + playerRadius &&
          Math.abs(testZ.z - wz) < wallHalfWidth + playerRadius
        ) collidesZ = true;
      }

      if (collidesX && collidesZ) return currentPos.clone();
      if (collidesX) return new THREE.Vector3(currentPos.x, currentPos.y, newPos.z);
      if (collidesZ) return new THREE.Vector3(newPos.x, currentPos.y, currentPos.z);
      return newPos;
    }

    function initMaze() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (containerRef.current) containerRef.current.appendChild(renderer.domElement);

      if (minimapRef.current) {
        minimapRef.current.width = 200;
        minimapRef.current.height = 200;
        minimapCtx = minimapRef.current.getContext('2d');
      }

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      walls = createSolidWalls(scene);

      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x303030,
        roughness: 0.8,
        metalness: 0.2
      });
      const groundGeometry = new THREE.PlaneGeometry(mazeSize * 2, mazeSize * 2);
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      const freeSpaces: {x: number, z: number}[] = [];
      for (let z = 0; z < mazeSize; z++) {
        for (let x = 0; x < mazeSize; x++) {
          if (maze[z][x] === 0) freeSpaces.push({x, z});
        }
      }

      const goalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const goalMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        emissive: 0xFFD700,
        emissiveIntensity: 0.5
      });
      goal = new THREE.Mesh(goalGeometry, goalMaterial);

      const spawnPoint = freeSpaces[0];
      const goalPoint = freeSpaces[freeSpaces.length - 2];

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

      function trackPlayerPath() {
        if (!minimapCtx) return;

        const canvasSize = 200;
        const cellSize = Math.floor(canvasSize / mazeSize);

        const gridX = Math.floor((cameraHolder.position.x + mazeSize * wallWidth / 2) / wallWidth);
        const gridZ = Math.floor((cameraHolder.position.z + mazeSize * wallWidth / 2) / wallWidth);
        const exactX = ((cameraHolder.position.x + mazeSize * wallWidth / 2) / wallWidth);
        const exactZ = ((cameraHolder.position.z + mazeSize * wallWidth / 2) / wallWidth);

        const cellKey = `${gridX},${gridZ}`;
        if (gridX >= 0 && gridX < mazeSize && gridZ >= 0 && gridZ < mazeSize && maze[gridZ][gridX] === 0) {
          visitedCells.add(cellKey);
        }

        minimapCtx.clearRect(0, 0, canvasSize, canvasSize);
        minimapCtx.fillStyle = 'black';
        for (let z = 0; z < mazeSize; z++) {
          for (let x = 0; x < mazeSize; x++) {
            if (maze[z][x] === 1) minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
          }
        }

        minimapCtx.fillStyle = 'green';
        visitedCells.forEach(cell => {
          const [x, z] = cell.split(',').map(Number);
          if (x >= 0 && x < mazeSize && z >= 0 && z < mazeSize && maze[z][x] === 0) {
            minimapCtx.fillRect(x * cellSize, z * cellSize, cellSize, cellSize);
          }
        });

        minimapCtx.fillStyle = 'red';
        minimapCtx.beginPath();
        const clampedX = Math.max(0, Math.min(mazeSize - 1, exactX));
        const clampedZ = Math.max(0, Math.min(mazeSize - 1, exactZ));
        minimapCtx.arc(clampedX * cellSize, clampedZ * cellSize, cellSize / 3, 0, Math.PI * 2);
        minimapCtx.fill();
      }

      function handleKeyDown(event: KeyboardEvent) {
        switch (event.key.toLowerCase()) {
          case 'w': inputState.keyboard.moveForward = true; break;
          case 's': inputState.keyboard.moveBackward = true; break;
          case 'a': inputState.keyboard.moveLeft = true; break;
          case 'd': inputState.keyboard.moveRight = true; break;
        }
      }

      function handleKeyUp(event: KeyboardEvent) {
        switch (event.key.toLowerCase()) {
          case 'w': inputState.keyboard.moveForward = false; break;
          case 's': inputState.keyboard.moveBackward = false; break;
          case 'a': inputState.keyboard.moveLeft = false; break;
          case 'd': inputState.keyboard.moveRight = false; break;
        }
      }

      function handleMouseMove(event: MouseEvent) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
        cameraHolder.rotation.y -= movementX * 0.002;
        camera.rotation.x -= movementY * 0.002;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      }

      function animate(currentTime: number) {
        animationFrameId = requestAnimationFrame(animate);

        if (!lastFrameTime) lastFrameTime = currentTime;
        const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
        lastFrameTime = currentTime;

        const frameSpeed = moveSpeed * deltaTime;

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(cameraHolder.quaternion);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(cameraHolder.quaternion);
        right.normalize();

        const movement = new THREE.Vector3(0, 0, 0);
        if (inputState.keyboard.moveForward || (mobileControlsEnabled && inputState.touch.moveForward)) {
          movement.add(forward.clone().multiplyScalar(frameSpeed));
        }
        if (inputState.keyboard.moveBackward || (mobileControlsEnabled && inputState.touch.moveBackward)) {
          movement.add(forward.clone().multiplyScalar(-frameSpeed));
        }
        if (inputState.keyboard.moveLeft || (mobileControlsEnabled && inputState.touch.moveLeft)) {
          movement.add(right.clone().multiplyScalar(-frameSpeed));
        }
        if (inputState.keyboard.moveRight || (mobileControlsEnabled && inputState.touch.moveRight)) {
          movement.add(right.clone().multiplyScalar(frameSpeed));
        }

        if (movement.length() > 0) {
          const newPosition = checkCollision(cameraHolder.position, movement);
          cameraHolder.position.copy(newPosition);
        }

        trackPlayerPath();

        if (cameraHolder.position.distanceTo(goal.position) < 1) {
          setGameStatus("Goal Reached!");
          window.location.href = "/";
        }

        renderer.render(scene, camera);
      }

      function requestPointerLock() {
        renderer.domElement.requestPointerLock();
      }

      renderer.domElement.addEventListener('click', requestPointerLock);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      document.addEventListener('mousemove', handleMouseMove);

      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
        renderer.domElement.removeEventListener('click', requestPointerLock);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('mousemove', handleMouseMove);
        removeExistingTouchControls();
        if (renderer) {
          renderer.dispose();
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
        }
      };
    }

    cleanupFunction = initMaze();

    if (mobileControlsEnabled && containerRef.current) {
      createTouchControls(containerRef.current);
    } else {
      removeExistingTouchControls();
    }

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (cleanupFunction) cleanupFunction();
      window.removeEventListener('resize', handleResize);
      unlockScreenOrientation();
      const touchControlsStyle = document.getElementById('touch-controls-style');
      if (touchControlsStyle) touchControlsStyle.remove();
    };
  }, [mobileControlsEnabled]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <canvas
        ref={minimapRef}
        style={{ position: 'absolute', top: '10px', right: '10px', border: '2px solid white', backgroundColor: 'rgba(255,255,255,0.5)' }}
      />
      <div
        style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px' }}
      >
        <h3>Maze Challenge</h3>
        <p>WASD: Move</p>
        <p>Click to look around</p>
        <p>Status: {gameStatus}</p>
      </div>
      <div
        style={{
          position: 'absolute', top: '120px', left: '10px', color: 'white', background: 'rgba(0,0,0,0.7)',
          padding: '10px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', fontSize: '14px'
        }}
      >
        <span>Mobile Controls:</span>
        <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', marginLeft: '10px' }}>
          <input
            type="checkbox"
            checked={mobileControlsEnabled}
            onChange={toggleMobileControls}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: mobileControlsEnabled ? '#2196F3' : '#ccc', transition: '.4s', borderRadius: '34px'
            }}
          >
            <span
              style={{
                position: 'absolute', content: '""', height: '14px', width: '14px',
                left: mobileControlsEnabled ? '23px' : '3px', bottom: '3px', backgroundColor: 'white',
                transition: '.4s', borderRadius: '50%'
              }}
            />
          </span>
        </label>
      </div>
      {mobileControlsEnabled && (
        <div
          style={{
            position: 'absolute', top: '170px', left: '10px', color: 'white', background: 'rgba(0,0,0,0.7)',
            padding: '10px 15px', borderRadius: '10px', fontSize: '14px'
          }}
        >
          <p>Left joystick: Move</p>
          <p>Right area: Look around</p>
        </div>
      )}
    </div>
  );
}