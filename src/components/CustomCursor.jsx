import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
 const cursorRef = useRef();

  useEffect(() => {
    // Create custom cursor follower effect
    const cursor = cursorRef.current;
    if (!cursor) return;

    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;

    const updateCursorPosition = () => {
      const diffX = targetX - cursorX;
      const diffY = targetY - cursorY;
      
      cursorX += diffX * 0.1;
      cursorY += diffY * 0.1;
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      
      requestAnimationFrame(updateCursorPosition);
    };

    // Initial animation call
    updateCursorPosition();

    // Track mouse movement
    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Handle hover effects for interactive elements
    const handleElementHover = () => {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.style.opacity = '0.4';
    };

    const handleElementLeave = () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      cursor.style.opacity = '1';
    };

    // Apply hover effects to buttons and links
    const interactiveElements = document.querySelectorAll('button, a');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementHover);
      element.addEventListener('mouseleave', handleElementLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementHover);
        element.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-follower"></div>
  );
}

export default CustomCursor