import React, { useEffect, useRef } from 'react';

const GridBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Grid properties
    const gridSize = 40;
    const dotSize = 1;
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse movement
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Draw grid dots
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const distX = mouseX - x;
          const distY = mouseY - y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          
          // Create a ripple effect around the mouse
          let size = dotSize;
          if (distance < 200) {
            size = dotSize + (1 - distance / 200) * 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (1 - distance / 200) * 0.7})`;
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          }
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationFrameId = window.requestAnimationFrame(drawGrid);
    };
    
    drawGrid();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-40"
    />
  );
};

export default GridBackground;