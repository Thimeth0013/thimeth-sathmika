import { useEffect, useRef, useState } from "react";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ images, rotateToIconIndex }) {
  const canvasRef = useRef(null);
  const [iconPositions, setIconPositions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState(null);
  const animationFrameRef = useRef(0);
  
  // Ref to track rotation state
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef([]);
  const imagesLoadedRef = useRef([]);

  // Create icon canvases
  useEffect(() => {
    if (!images) return;
    imagesLoadedRef.current = new Array(images.length).fill(false);
    const newIconCanvases = images.map((imgSrc, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 50;
      offscreen.height = 50;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
          offCtx.drawImage(img, 5, 5, 40, 40);
          imagesLoadedRef.current[index] = true;
        };
      }
      return offscreen;
    });
    iconCanvasesRef.current = newIconCanvases;
  }, [images]);

  // Generate sphere positions
  useEffect(() => {
    const newIcons = [];
    const numIcons = images?.length || 20;
    const sphereRadius = 160;
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      newIcons.push({
        x: Math.cos(phi) * r * sphereRadius,
        y: y * sphereRadius,
        z: Math.sin(phi) * r * sphereRadius,
        id: i,
      });
    }
    setIconPositions(newIcons);
  }, [images]);

  // Handle external rotation (Hover)
  useEffect(() => {
    if (rotateToIconIndex !== null && iconPositions.length > 0) {
      const icon = iconPositions[rotateToIconIndex];
      if (!icon) return;

      const targetX = -Math.atan2(icon.y, Math.sqrt(icon.x * icon.x + icon.z * icon.z));
      const targetY = Math.atan2(icon.x, icon.z);
      
      setTargetRotation({
        x: targetX * 0.3, // Dampen the vertical target
        y: targetY,
        startX: rotationRef.current.x,
        startY: rotationRef.current.y,
        startTime: performance.now(),
        duration: 900,
      });
    }
  }, [rotateToIconIndex, iconPositions]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      // Horizontal (Y axis) is full speed, Vertical (X axis) is heavily dampened
      rotationRef.current.y += deltaX * 0.005;
      rotationRef.current.x += deltaY * 0.001; 
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;

      if (targetRotation) {
        const elapsed = time - targetRotation.startTime;
        const progress = Math.min(1, elapsed / targetRotation.duration);
        const eased = easeOutCubic(progress);
        
        rotationRef.current.x = targetRotation.startX + (targetRotation.x - targetRotation.startX) * eased;
        rotationRef.current.y = targetRotation.startY + (targetRotation.y - targetRotation.startY) * eased;
        
        if (progress >= 1) setTargetRotation(null);
      } else if (!isDragging) {
        // Subtle drift: X (Vertical) is dampened to 10% of Y (Horizontal)
        rotationRef.current.y += (dx / canvas.width) * 0.01;
        rotationRef.current.x += (dy / canvas.height) * 0.001; 
      }

      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      // Sort and project
      const projected = iconPositions.map((icon, idx) => {
        const rX = icon.x * cosY - icon.z * sinY;
        const rZ = icon.x * sinY + icon.z * cosY;
        const rY = icon.y * cosX + rZ * sinX;
        const finalZ = rZ * cosX - icon.y * sinX;

        return { ...icon, index: idx, rX, rY, rZ: finalZ };
      }).sort((a, b) => a.rZ - b.rZ);

      projected.forEach((icon) => {
        const scale = (icon.rZ + 350) / 500;
        const opacity = Math.max(0.1, Math.min(1, (icon.rZ + 200) / 400));

        ctx.save();
        ctx.translate(centerX + icon.rX, centerY + icon.rY);
        ctx.scale(scale, scale);

        // --- PULSING BACKLIGHT SHINE ---
        if (rotateToIconIndex === icon.index) {
          const pulse = Math.sin(time / 200) * 0.05 + 0.2; 
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
          gradient.addColorStop(0, `rgba(30, 64, 175, ${pulse})`); 
          gradient.addColorStop(1, "rgba(30, 64, 175, 0)");
          
          ctx.beginPath();
          ctx.arc(0, 0, 70, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.globalAlpha = opacity;
        if (iconCanvasesRef.current[icon.index] && imagesLoadedRef.current[icon.index]) {
          ctx.drawImage(iconCanvasesRef.current[icon.index], -25, -25, 50, 50);
        }
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [images, iconPositions, isDragging, mousePos, targetRotation, rotateToIconIndex]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="rounded-lg cursor-grab active:cursor-grabbing w-full h-full max-w-[600px] aspect-square"
    />
  );
}