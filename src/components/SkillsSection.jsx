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
  
  // Skills data with proficiency levels (0-100)
  const frontendSkills = [
    { name: "React", proficiency: 92 },
    { name: "JavaScript", proficiency: 90 },
    { name: "HTML/CSS", proficiency: 95 },
    { name: "TailwindCSS", proficiency: 88 },
    { name: "TypeScript", proficiency: 85 }
  ];
  
  const backendSkills = [
    { name: "Node.js", proficiency: 86 },
    { name: "Express", proficiency: 84 },
    { name: "MongoDB", proficiency: 80 },
    { name: "SQL", proficiency: 78 },
    { name: "Python", proficiency: 75 }
  ];
  
  const otherSkills = [
    { name: "Three.js", proficiency: 70 },
    { name: "GSAP", proficiency: 82 },
    { name: "Git", proficiency: 88 },
    { name: "Docker", proficiency: 72 },
    { name: "AWS", proficiency: 68 }
  ];

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
      // This creates a more concentrated effect in the center
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
        
        // Select all skill progress bars and cards
        const skillBars = document.querySelectorAll('.skill-progress-fill');
        const skillCards = document.querySelectorAll('.skill-category');
        
        gsap.set(skillBars, { width: 0 });
        gsap.set(skillCards, { opacity: 0, y: 50 });
        
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
        
        // Animate skill category cards
        masterTimeline.to(skillCards, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.5);
        
        // Animate skill bars
        masterTimeline.to(skillBars, {
          width: function(index, target) {
            return target.getAttribute('data-percent') + '%';
          },
          duration: 1.5,
          stagger: 0.05,
          ease: 'power2.out'
        }, 0.8);
        
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

  // Render skill item
  const renderSkillItem = (skill, index) => (
    <div key={index} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-['Manrope'] text-stone-300">{skill.name}</span>
        <span className="text-xs font-['Manrope'] text-stone-400">{skill.proficiency}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="skill-progress-fill h-full bg-gradient-to-r from-stone-500 to-stone-400 rounded-full"
          data-percent={skill.proficiency}
        ></div>
      </div>
    </div>
  );

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen w-full py-24 text-white bg-zinc-900 overflow-hidden"
    >
      {/* Particle animation container - absolute positioned to fill the space */}
      <div 
        ref={particlesContainerRef} 
        className="absolute inset-0 z-0 opacity-40"
      >
        {/* Three.js will inject the canvas here */}
      </div>
      
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
          className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Frontend Skills */}
          <div className="skill-category bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-stone-700/50 text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
                  <line x1="12" y1="22" x2="12" y2="15.5"/>
                  <polyline points="22 8.5 12 15.5 2 8.5"/>
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-['Manrope'] uppercase tracking-wider text-stone-300">Frontend</h3>
            </div>
            
            <div className="space-y-4">
              {frontendSkills.map(renderSkillItem)}
            </div>
          </div>
          
          {/* Backend Skills */}
          <div className="skill-category bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-stone-700/50 text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-['Manrope'] uppercase tracking-wider text-stone-300">Backend</h3>
            </div>
            
            <div className="space-y-4">
              {backendSkills.map(renderSkillItem)}
            </div>
          </div>
          
          {/* Other Skills */}
          <div className="skill-category bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-stone-700/50 text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-['Manrope'] uppercase tracking-wider text-stone-300">Other</h3>
            </div>
            
            <div className="space-y-4">
              {otherSkills.map(renderSkillItem)}
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