import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TextSection = () => {
  const sectionRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);

  useEffect(() => {
    // Make sure all refs are attached
    if (!sectionRef.current || !leftTextRef.current || !rightTextRef.current) return;

    // Set up the scroll-triggered animations
    const section = sectionRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;
    
    // Get initial positions for both text elements
    const leftInitialX = leftText.getBoundingClientRect().left;
    const rightInitialX = rightText.getBoundingClientRect().left;
    
    // Create scroll-driven animation for left text (moves left)
    gsap.fromTo(leftText, 
      { x: 0 }, 
      {
        x: '-100%', // Move left by 100% of its width
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom', // Start when top of section reaches bottom of viewport
          end: 'bottom top', // End when bottom of section reaches top of viewport
          scrub: true, // Smooth scrubbing tied to scroll position
          markers: false,
        }
      }
    );
    
    // Create scroll-driven animation for right text (moves right)
    gsap.fromTo(rightText, 
      { x: 0 }, 
      {
        x: '50%', // Move right by 50% of its width
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom', // Start when top of section reaches bottom of viewport
          end: 'bottom top', // End when bottom of section reaches top of viewport
          scrub: true, // Smooth scrubbing tied to scroll position
          markers: false,
        }
      }
    );
    
    // Optional parallax effect for the section itself
    gsap.fromTo(section,
      { backgroundPositionY: '0%' },
      {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
    
    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full flex flex-col justify-center overflow-hidden bg-transparent"
    >
      {/* Upper text row - moves left */}
      <div className="w-full overflow-hidden mb-4">
        <div 
          ref={leftTextRef} 
          className="whitespace-nowrap will-change-transform"
        >
          <span className="text-7xl md:text-9xl font-bold tracking-tighter opacity-10 text-white inline-block mx-6">CREATOR</span>
          <span className="text-7xl md:text-9xl font-bold tracking-tighter opacity-10 text-white inline-block mx-6">DEVELOPER</span>
          <span className="text-7xl md:text-9xl font-bold tracking-tighter opacity-10 text-white inline-block mx-6">DESIGNER</span>
          <span className="text-7xl md:text-9xl font-bold tracking-tighter opacity-10 text-white inline-block mx-6">CREATOR</span>
          <span className="text-7xl md:text-9xl font-bold tracking-tighter opacity-10 text-white inline-block mx-6">DEVELOPER</span>
          <span className="text-7xl md:text-9xl font-bold tracking-tighter opacity-10 text-white inline-block mx-6">DESIGNER</span>
        </div>
      </div>
      
      
      
      {/* Subtle gradient overlays for edge fading */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent opacity-20 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent opacity-20 pointer-events-none"></div>
    </section>
  );
};

export default TextSection;