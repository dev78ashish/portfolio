import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const locationRef = useRef(null);
  const portfolioTextRef = useRef(null);
  const descriptionRef = useRef(null);
  const roleRef = useRef(null);
  const moonContainerRef = useRef(null);
  const largeNameRef = useRef(null);
  const menuRef = useRef(null);
  
  const [mounted, setMounted] = useState(false);

  // Set up the 3D moon
  useEffect(() => {
    if (!moonContainerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    // Responsive renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    
    // Set renderer size and append to DOM
    const containerSize = Math.min(window.innerWidth * 0.5, 500);
    renderer.setSize(containerSize, containerSize);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Clear container before appending
    while (moonContainerRef.current.firstChild) {
      moonContainerRef.current.removeChild(moonContainerRef.current.firstChild);
    }
    
    moonContainerRef.current.appendChild(renderer.domElement);
    
    // Create moon geometry and material
    const moonGeometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Load moon texture
    const textureLoader = new THREE.TextureLoader();
    
    // Create texture from a data URL for base color
    const moonTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg'
    );
    
    // Create bump map (normal map) for 3D effect - we'll use same texture with different processing
    const moonBumpMap = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg'
    );
    
    // Create material with textures
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonBumpMap,
      bumpScale: 0.02,
      roughness: 1,
      metalness: 0
    });
    
    // Create moon mesh and add to scene
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Add directional light (like sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Create animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Slowly rotate the moon
      moon.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const newSize = Math.min(window.innerWidth * 0.5, 500);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize, newSize);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (moonContainerRef.current) {
        moonContainerRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources
      moonGeometry.dispose();
      moonMaterial.dispose();
      moonTexture.dispose();
      moonBumpMap.dispose();
      renderer.dispose();
    };
  }, [moonContainerRef.current]);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    // Ensure SplitType is properly imported
    const initAnimations = async () => {
      try {
        // Dynamically import SplitType
        const SplitTypeModule = await import('split-type');
        const SplitType = SplitTypeModule.default;
        
        if (!locationRef.current || !portfolioTextRef.current || 
            !descriptionRef.current || !roleRef.current || 
            !largeNameRef.current) {
          console.error('One or more refs are not attached to DOM elements');
          return;
        }
        
        // Initialize master timeline
        const masterTimeline = gsap.timeline();
        
        // Split text for animations with null checks
        const locationSplit = new SplitType(locationRef.current, { types: 'chars' });
        const descriptionSplit = new SplitType(descriptionRef.current, { types: 'lines' });
        const roleSplit = new SplitType(roleRef.current, { types: 'words' });
        const largeNameSplit = new SplitType(largeNameRef.current, { types: 'chars' });
        
        // Handle portfolioTextRef separately with a check
        let portfolioSplit = null;
        if (portfolioTextRef.current) {
          portfolioSplit = new SplitType(portfolioTextRef.current, { types: 'chars' });
        }
        
        // Set initial states with null checks
        if (locationSplit.chars) {
          gsap.set(locationSplit.chars, { opacity: 0, y: 30 });
        }
        
        if (portfolioSplit && portfolioSplit.chars) {
          gsap.set(portfolioSplit.chars, { opacity: 0, y: 30 });
        }
        
        if (descriptionSplit.lines) {
          gsap.set(descriptionSplit.lines, { opacity: 0, y: 30 });
        }
        
        if (roleSplit.words) {
          gsap.set(roleSplit.words, { opacity: 0, y: 30 });
        }
        
        if (menuRef.current) {
          gsap.set(menuRef.current, { opacity: 0, y: 30 });
        }
        
        if (moonContainerRef.current) {
          gsap.set(moonContainerRef.current, {
            opacity: 0,
            scale: 0.8
          });
        }
        
        if (largeNameSplit.chars) {
          gsap.set(largeNameSplit.chars, {
            opacity: 0,
            y: 50
          });
        }
        
        // Location animation (formerly Name animation)
        if (locationSplit.chars) {
          masterTimeline.to(locationSplit.chars, {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power3.out'
          }, 0.2);
        }
        
        // Menu animation
        if (menuRef.current) {
          masterTimeline.to(menuRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          }, 0.5);
        }
        
        // Moon animation - adjusted timing to appear before text
        if (moonContainerRef.current) {
          masterTimeline.to(moonContainerRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power2.inOut'
          }, 0);
        }
        
        // Description animation
        if (descriptionSplit.lines) {
          masterTimeline.to(descriptionSplit.lines, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
          }, 1.2);
        }
        
        // Large name animation
        if (largeNameSplit.chars) {
          masterTimeline.to(largeNameSplit.chars, {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            duration: 1,
            ease: 'power2.out'
          }, 1.5);
        }
        
        // Role text animation
        if (roleSplit.words) {
          masterTimeline.to(roleSplit.words, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
          }, 1.7);
        }
        
        // Portfolio text animation
        if (portfolioSplit && portfolioSplit.chars) {
          masterTimeline.to(portfolioSplit.chars, {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            duration: 0.6,
            ease: 'power2.out'
          }, 2.0);
        }
        
        // Scroll-triggered animations
        if (sectionRef.current && moonContainerRef.current) {
          gsap.to(moonContainerRef.current, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            },
            y: -50,
            scale: 0.95,
            opacity: 0.8
          });
        }
        
        if (sectionRef.current && largeNameRef.current) {
          gsap.to(largeNameRef.current, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            },
            y: 100,
            opacity: 0.6
          });
        }
      } catch (error) {
        console.error('Animation setup error:', error);
      }
    };
    
    // Initialize animations only after component is mounted
    if (mounted) {
      initAnimations();
    }
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted]);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full text-white flex flex-col justify-between overflow-hidden bg-zinc-900"
    >
      {/* Moon container with Three.js canvas */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center pointer-events-none z-0">
        <div 
          ref={moonContainerRef} 
          className="w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]"
        >
          {/* Three.js will inject the canvas here */}
        </div>
      </div>
      
      {/* Header with location instead of name */}
      <div className="w-full flex justify-between items-center px-6 md:px-12 py-6 md:py-10 relative z-10">
        <h2 
          ref={locationRef} 
          className="text-sm flex font-light tracking-wider text-stone-300"
        >
          <MapPin size={18} /> NEW DELHI
        </h2>
        
        <div ref={menuRef} className="flex items-center">
          <div className="border border-stone-500 text-stone-300 px-4 py-1 rounded-full text-sm tracking-wider hover:text-white hover:border-white transition-all duration-300 cursor-pointer">
            MENU •
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 right-6 md:right-12 transform -translate-y-1/2 max-w-md z-10">
        <p 
          ref={descriptionRef} 
          className="text-sm md:text-base font-light text-stone-400 leading-relaxed text-right"
        >
          <span className="block">I am Devashish Prasad, a full stack developer.</span>
          <span className="block">I am good at balancing logical and intuitive thinking,</span>
          <span className="block">function and emotion, stillness and movement, and</span>
          <span className="block">seeking and expressing the best digital solutions</span>
          <span className="block">that fulfills user needs and objectives.</span>
        </p>
      </div>
      
      <div className="absolute bottom-24 md:bottom-16 left-0 w-full z-10">
        <h1 
          ref={largeNameRef} 
          className="text-6xl md:text-8xl lg:text-9xl font-light tracking-widest text-stone-300 opacity-90 px-6 md:px-12"
        >
          DEVASHISH PRASAD
        </h1>
      </div>
      
      <div className="absolute bottom-12 md:bottom-6 left-6 md:left-12 z-10">
        <p 
          ref={roleRef}
          className="text-xs md:text-sm tracking-wider text-stone-400"
        >
          <span className="inline-block mr-3 hover:text-stone-200 transition-colors duration-300">WEB DESIGN</span> / 
          <span className="inline-block mx-3 hover:text-stone-200 transition-colors duration-300">FULL STACK</span> / 
          <span className="inline-block ml-3 hover:text-stone-200 transition-colors duration-300">DEVELOPMENT</span>
        </p>
      </div>
      
      {/* Portfolio text vertical with smaller font size */}
      <div className="absolute bottom-12 md:bottom-6 right-6 md:right-12 flex items-center z-10">
        <div ref={portfolioTextRef} className="writing-vertical transform rotate-180 text-stone-400">
          <span className="text-[10px] tracking-widest mr-1">(PORTFOLIO)</span>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVGhD7dixDoJAEEXRWVt7/v9LbS2hILtmE9LQkZmQc5JbUbw3hYWZ2Sikj9PLrA9HB27HjqRWJfJTOmtVIpv0bFUiKW9WJZLmzapEcilNViWS82ZVIrl81qpEyvRZqxIp88+qRMr88xkp071ZlUjum1WJ5Ly1KpFcPluVSMmbVYmk6VmrEknTs1YlkrIqEbP/tus+et3eGZP09x8AAAAASUVORK5CYII=')] opacity-5 z-0"></div>
    </section>
  );
};

export default HeroSection;