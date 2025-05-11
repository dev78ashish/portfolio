import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

const IllustrationParallax = () => {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const threeContainerRef = useRef(null);
  const textRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Three.js setup and animation
  useEffect(() => {
    if (!threeContainerRef.current || !mounted) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.6), 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    
    // Sizing
    const updateSize = () => {
      const container = threeContainerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    // Set initial size
    renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear container
    while (threeContainerRef.current.firstChild) {
      threeContainerRef.current.removeChild(threeContainerRef.current.firstChild);
    }
    
    threeContainerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Positions - scatter particles in a cube
      positions[i] = (Math.random() - 0.5) * 10;
      
      // Colors - create a gradient effect
      if (i % 3 === 0) {
        // Red component - subtle variations
        colors[i] = 0.8 + Math.random() * 0.2;
      } else if (i % 3 === 1) {
        // Green component - subtle variations
        colors[i] = 0.8 + Math.random() * 0.2;
      } else {
        // Blue component - subtle variations
        colors[i] = 0.9 + Math.random() * 0.1;
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material with vertex colors
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    // Create the particles mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add a subtle pulsing light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 3;
    
    // Dynamic mouse interaction
    const pointer = {
      x: 0,
      y: 0
    };
    
    const handleMouseMove = (event) => {
      // Calculate pointer position in normalized device coordinates
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation Loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate particles
      particles.rotation.x = elapsedTime * 0.05;
      particles.rotation.y = elapsedTime * 0.03;
      
      // Move particles slightly toward mouse
      particles.rotation.x += (pointer.y * 0.5 - particles.rotation.x) * 0.05;
      particles.rotation.y += (pointer.x * 0.5 - particles.rotation.y) * 0.05;
      
      // Pulse the light
      pointLight.intensity = 1 + Math.sin(elapsedTime * 2) * 0.3;
      
      // Render
      renderer.render(scene, camera);
      
      // Call animate again on the next frame
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', updateSize);
    updateSize();
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
      
      // Dispose of Three.js resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);

  // GSAP animations
  useEffect(() => {
    setMounted(true);
    
    // Animate container in
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.inOut' }
    );
    
    // Create marquee animation
    if (marqueeRef.current) {
      const marqueeContent = marqueeRef.current.children[0];
      const marqueeWidth = marqueeContent.offsetWidth;
      
      // Create duplicate content for seamless loop
      const clone = marqueeContent.cloneNode(true);
      marqueeRef.current.appendChild(clone);
      
      // Animation timeline
      const marqueeTl = gsap.timeline({ repeat: -1 });
      
      marqueeTl.to([marqueeContent, clone], {
        x: -marqueeWidth,
        ease: 'none',
        duration: 20
      });
    }
    
    // Animate text content
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.5
        }
      );
    }
    
    // Mouse parallax effect
    const handleParallax = (e) => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Only apply effect when container is in view
      if (
        containerRect.bottom < 0 ||
        containerRect.top > window.innerHeight
      ) return;

      // Calculate mouse position relative to container center
      const xRelative = (e.clientX - containerRect.left - containerRect.width / 2) / containerRect.width;
      const yRelative = (e.clientY - containerRect.top - containerRect.height / 2) / containerRect.height;
      
      // Parallax effect on text
      if (textRef.current) {
        gsap.to(textRef.current, {
          x: xRelative * 30,
          y: yRelative * 30,
          duration: 1,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleParallax);
    
    return () => {
      window.removeEventListener('mousemove', handleParallax);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[80vh] w-full overflow-hidden ">
      {/* Marquee Text */}
      <div ref={marqueeRef} className="w-full overflow-hidden whitespace-nowrap py-4 border-y border-white/10">
        <div className="inline-block">
          <span className="text-8xl md:text-9xl font-bold tracking-tight opacity-10 text-white px-8">CREATOR</span>
          <span className="text-8xl md:text-9xl font-bold tracking-tight opacity-10 text-white px-8">DEVELOPER</span>
          <span className="text-8xl md:text-9xl font-bold tracking-tight opacity-10 text-white px-8">DESIGNER</span>
        </div>
      </div>
      
      {/* Three.js Background Container */}
      <div 
        ref={threeContainerRef} 
        className="absolute inset-0 z-0"
      />
      
      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div 
          ref={textRef} 
          className="text-center max-w-2xl mx-auto px-4"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-white bg-gradient-to-r from-white to-white/70 inline-block text-transparent bg-clip-text">
            Turning Vision Into Reality
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
            Combining artistry and technology to create digital experiences 
            that leave a lasting impression.
          </p>
          <div className="mt-10">
            <button className="px-8 py-3 border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all rounded-full mr-4">
              See My Work
            </button>
            <button className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 transition-all rounded-full backdrop-blur-sm">
              About Me
            </button>
          </div>
        </div>
      </div>
      
      {/* Abstract Geometric Elements */}
      <div className="absolute left-10 top-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      <div className="absolute right-20 bottom-1/4 w-24 h-24 border border-white/30 rotate-45"></div>
      <div className="absolute left-1/4 bottom-20 w-8 h-8 bg-white/5 rounded-full backdrop-blur-md"></div>
      <div className="absolute right-1/4 top-40 w-12 h-12 bg-white/5 backdrop-blur-md"></div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent opacity-40"></div>
    </div>
  );
};

export default IllustrationParallax;