import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const skillsContainerRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  // Skills data - without proficiency levels
  const skills = {
    frontend: [
      { name: "React", icon: "⚛️" },
      { name: "JavaScript", icon: "JS" },
      { name: "HTML/CSS", icon: "</>" },
      { name: "TailwindCSS", icon: "TW" },
      { name: "TypeScript", icon: "TS" }
    ],
    backend: [
      { name: "Node.js", icon: "🟢" },
      { name: "Express", icon: "EX" },
      { name: "MongoDB", icon: "DB" },
      { name: "SQL", icon: "SQL" },
      { name: "Python", icon: "PY" }
    ],
    other: [
      { name: "Three.js", icon: "3D" },
      { name: "GSAP", icon: "GS" },
      { name: "Git", icon: "GIT" },
      { name: "Docker", icon: "🐳" },
      { name: "AWS", icon: "AWS" }
    ]
  };

  // Set up the particles animation
  useEffect(() => {
    if (!particlesContainerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Clear container before appending
    while (particlesContainerRef.current.firstChild) {
      particlesContainerRef.current.removeChild(particlesContainerRef.current.firstChild);
    }
    
    particlesContainerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    // Fill the positions array with random values
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position particles in a rough sphere shape
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 15;
      
      posArray[i] = (Math.cos(angle1) * Math.sin(angle2)) * radius;
      posArray[i + 1] = (Math.sin(angle1) * Math.sin(angle2)) * radius;
      posArray[i + 2] = Math.cos(angle2) * radius;
      i += 2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material for the particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Position camera
    camera.position.z = 20;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Slowly rotate particles
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add scroll interaction
    const updateParticlesOnScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      
      // Calculate normalized scroll position within the section
      const scrollPosition = (scrollY - sectionTop + window.innerHeight) / (sectionHeight + window.innerHeight);
      
      if (scrollPosition > 0 && scrollPosition < 1) {
        // Rotate based on scroll position
        particlesMesh.rotation.y = scrollPosition * Math.PI * 0.5;
        particlesMesh.rotation.x = scrollPosition * Math.PI * 0.25;
      }
    };
    
    window.addEventListener('scroll', updateParticlesOnScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateParticlesOnScroll);
      
      if (particlesContainerRef.current && particlesContainerRef.current.contains(renderer.domElement)) {
        particlesContainerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Three.js resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [particlesContainerRef.current]);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    const initAnimations = async () => {
      try {
        // Dynamically import SplitType
        const SplitTypeModule = await import('split-type');
        const SplitType = SplitTypeModule.default;
        
        if (!titleRef.current || !skillsContainerRef.current) {
          console.error('One or more refs are not attached to DOM elements');
          return;
        }
        
        // Split text for animations
        const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
        
        // Set initial states
        gsap.set(titleSplit.chars, { opacity: 0, y: 50 });
        
        // Select all skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        const categoryTitles = document.querySelectorAll('.category-title');
        
        gsap.set(skillCards, { opacity: 0, y: 30, scale: 0.9 });
        gsap.set(categoryTitles, { opacity: 0, y: 30 });
        
        // Create scroll trigger for the entire section
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "center center",
            toggleActions: "play none none none"
          }
        });
        
        // Title animation
        masterTimeline.to(titleSplit.chars, {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: 'power3.out'
        }, 0);
        
        // Animate category titles
        masterTimeline.to(categoryTitles, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.4);
        
        // Animate skill cards
        masterTimeline.to(skillCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: 'back.out(1.5)'
        }, 0.6);
        
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
      className="relative min-h-screen w-full py-24 text-white bg-zinc-900 overflow-hidden"
    >
      {/* Particle animation container */}
      <div 
        ref={particlesContainerRef} 
        className="absolute inset-0 z-0 opacity-40"
      ></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Title */}
        <h2 
          ref={titleRef} 
          className="text-3xl md:text-4xl font-medium tracking-wider text-stone-300 font-['Manrope'] uppercase"
        >
          Technical Skills
        </h2>
        
        {/* Skills Container */}
        <div 
          ref={skillsContainerRef}
          className="mt-16 space-y-16"
        >
          {/* Frontend Skills */}
          <div>
            <h3 className="category-title text-xl font-['Manrope'] uppercase tracking-wider text-stone-300 mb-8 flex items-center">
              <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
                  <line x1="12" y1="22" x2="12" y2="15.5"/>
                  <polyline points="22 8.5 12 15.5 2 8.5"/>
                </svg>
              </div>
              Frontend
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {skills.frontend.map((skill, index) => (
                <div 
                  key={index} 
                  className="skill-card bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 hover:border-zinc-500 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/20 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-stone-700/50 text-stone-300 mb-3 group-hover:bg-stone-600/50 transition-colors duration-300">
                      <span className="text-lg font-medium">{skill.icon}</span>
                    </div>
                    <span className="text-stone-300 font-['Manrope'] text-sm md:text-base">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Backend Skills */}
          <div>
            <h3 className="category-title text-xl font-['Manrope'] uppercase tracking-wider text-stone-300 mb-8 flex items-center">
              <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
              </div>
              Backend
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {skills.backend.map((skill, index) => (
                <div 
                  key={index} 
                  className="skill-card bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 hover:border-zinc-500 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/20 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-stone-700/50 text-stone-300 mb-3 group-hover:bg-stone-600/50 transition-colors duration-300">
                      <span className="text-lg font-medium">{skill.icon}</span>
                    </div>
                    <span className="text-stone-300 font-['Manrope'] text-sm md:text-base">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Other Skills */}
          <div>
            <h3 className="category-title text-xl font-['Manrope'] uppercase tracking-wider text-stone-300 mb-8 flex items-center">
              <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              Other
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {skills.other.map((skill, index) => (
                <div 
                  key={index} 
                  className="skill-card bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 hover:border-zinc-500 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/20 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-stone-700/50 text-stone-300 mb-3 group-hover:bg-stone-600/50 transition-colors duration-300">
                      <span className="text-lg font-medium">{skill.icon}</span>
                    </div>
                    <span className="text-stone-300 font-['Manrope'] text-sm md:text-base">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVGhD7dixDoJAEEXRWVt7/v9LbS2hILtmE9LQkZmQc5JbUbw3hYWZ2Sikj9PLrA9HB27HjqRWJfJTOmtVIpv0bFUiKW9WJZLmzapEcilNViWS82ZVIrl81qpEyvRZqxIp88+qRMr88xkp071ZlUjum1WJ5Ly1KpFcPluVSMmbVYmk6VmrEknTs1YlkrIqEbP/tus+et3eGZP09x8AAAAASUVORK5CYII=')] opacity-5 z-0"></div>
      
      {/* Geometric accents */}
      <div className="absolute top-40 right-12 w-24 h-24 border border-zinc-700 rounded-full opacity-20 z-0"></div>
      <div className="absolute bottom-32 left-16 w-40 h-40 border border-zinc-700 rounded-full opacity-20 z-0"></div>
      <div className="absolute top-20 left-20 w-12 h-12 border border-zinc-700 opacity-20 z-0 transform rotate-45"></div>
    </section>
  );
};

export default SkillsSection;