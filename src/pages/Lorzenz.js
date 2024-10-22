import React, { useEffect, useRef } from 'react';

const LorenzAttractor = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const angleRef = useRef({ x: 0, y: 0, z: 0 });
  const scaleRef = useRef(15);
  const animationRef = useRef(null);

  // Lorenz parameters
  const PARAMS = {
    sigma: 10,
    rho: 28,
    beta: 8/3,
    dt: 0.005,
    particleCount: 50,
    tailLength: 50
  };

  class Particle {
    constructor() {
      this.positions = [{ 
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1
      }];
      this.hue = Math.random() * 360;
    }

    update() {
      const current = this.positions[this.positions.length - 1];
      const dx = PARAMS.sigma * (current.y - current.x) * PARAMS.dt;
      const dy = (current.x * (PARAMS.rho - current.z) - current.y) * PARAMS.dt;
      const dz = (current.x * current.y - PARAMS.beta * current.z) * PARAMS.dt;

      const newPos = {
        x: current.x + dx,
        y: current.y + dy,
        z: current.z + dz
      };

      this.positions.push(newPos);
      if (this.positions.length > PARAMS.tailLength) {
        this.positions.shift();
      }
    }
  }

  const rotate3D = (point, angles) => {
    let { x, y, z } = point;
    
    // Rotate X
    const cosX = Math.cos(angles.x);
    const sinX = Math.sin(angles.x);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    y = y1;
    z = z1;
    
    // Rotate Y
    const cosY = Math.cos(angles.y);
    const sinY = Math.sin(angles.y);
    const x2 = x * cosY + z * sinY;
    const z2 = -x * sinY + z * cosY;
    x = x2;
    z = z2;
    
    return { x, y, z };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update();

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${particle.hue}, 100%, 50%, 0.5)`;
      ctx.lineWidth = 1.5;

      particle.positions.forEach((pos, i) => {
        const rotated = rotate3D(pos, angleRef.current);
        const screenX = rotated.x * scaleRef.current + centerX;
        const screenY = rotated.y * scaleRef.current + centerY;
        
        i === 0 ? ctx.moveTo(screenX, screenY) : ctx.lineTo(screenX, screenY);
      });
      ctx.stroke();
    });

    // Auto-rotate
    angleRef.current.x += 0.002;
    angleRef.current.y += 0.003;

    animationRef.current = requestAnimationFrame(draw);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    scaleRef.current = Math.min(Math.max(5, scaleRef.current * (1 + delta)), 40);
  };

  useEffect(() => {
    // Initialize particles
    particlesRef.current = Array(PARAMS.particleCount)
      .fill(null)
      .map(() => new Particle());

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="p-4">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="border border-gray-700 rounded-lg bg-[#1a1a1a]"
          onWheel={handleWheel}
        />
      </div>
    </div>
  );
};

export default LorenzAttractor;