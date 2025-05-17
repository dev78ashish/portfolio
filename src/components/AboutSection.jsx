import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const educationCardRef = useRef(null);
  const experienceCardRef = useRef(null);
  const skillsCardRef = useRef(null);
  const interestsCardRef = useRef(null);
  const modelContainerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Set up the 3D object
  useEffect(() => {
    if (!modelContainerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    // Responsive renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    
    // Set renderer size and append to DOM
    const containerSize = Math.min(window.innerWidth * 0.4, 400);
    renderer.setSize(containerSize, containerSize);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Clear container before appending
    while (modelContainerRef.current.firstChild) {
      modelContainerRef.current.removeChild(modelContainerRef.current.firstChild);
    }
    
    modelContainerRef.current.appendChild(renderer.domElement);
    
    // Create more complex geometric shape (dodecahedron)
    const geometry = new THREE.DodecahedronGeometry(2, 0);
    
    // Create a wireframe material with slightly brighter color
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x9A9A9A,
      wireframe: true
    });
    
    // Create the solid material with a subtle glow and slightly lighter color
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x4A4A4A,
      shininess: 80,
      transparent: true,
      opacity: 0.7
    });
    
    // Create both meshes
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    
    // Add both meshes to the scene
    scene.add(wireframeMesh);
    scene.add(solidMesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x505050, 1);
    scene.add(ambientLight);
    
    // Add directional light with slightly warmer color
    const directionalLight = new THREE.DirectionalLight(0xFFEEDD, 1.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add point light for glow effect - slightly bluer for contrast
    const pointLight = new THREE.PointLight(0xCCDDFF, 1.2, 100);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Optional: add orbit controls for interactive rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    
    // Create animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Add slight wave motion to the geometry
      wireframeMesh.rotation.y += 0.002;
      solidMesh.rotation.y += 0.002;
      
      wireframeMesh.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
      solidMesh.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
      
      // Update controls
      controls.update();
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const newSize = Math.min(window.innerWidth * 0.4, 400);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize, newSize);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (modelContainerRef.current) {
        modelContainerRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources
      geometry.dispose();
      wireframeMaterial.dispose();
      solidMaterial.dispose();
      renderer.dispose();
    };
  }, [modelContainerRef.current]);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    const initAnimations = async () => {
      try {
        // Dynamically import SplitType
        const SplitTypeModule = await import('split-type');
        const SplitType = SplitTypeModule.default;
        
        if (!aboutTitleRef.current || !descriptionRef.current) {
          console.error('One or more refs are not attached to DOM elements');
          return;
        }
        
        // Initialize master timeline
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            toggleActions: "play none none none"
          }
        });
        
        // Split text for animations
        const aboutTitleSplit = new SplitType(aboutTitleRef.current, { types: 'chars' });
        const descriptionSplit = new SplitType(descriptionRef.current, { types: 'lines' });
        
        // Set initial states
        gsap.set(aboutTitleSplit.chars, { opacity: 0, y: 50 });
        gsap.set(descriptionSplit.lines, { opacity: 0, y: 30 });
        gsap.set([educationCardRef.current, experienceCardRef.current, 
                 skillsCardRef.current, interestsCardRef.current].filter(Boolean), 
                { opacity: 0, y: 50 });
        
        if (modelContainerRef.current) {
          gsap.set(modelContainerRef.current, {
            opacity: 0,
            scale: 0.8
          });
        }
        
        // About title animation
        masterTimeline.to(aboutTitleSplit.chars, {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: 'power3.out'
        }, 0);
        
        // 3D model animation
        if (modelContainerRef.current) {
          masterTimeline.to(modelContainerRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power2.inOut'
          }, 0.3);
        }
        
        // Description animation
        masterTimeline.to(descriptionSplit.lines, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.5);
        
        // Cards staggered animation
        const cards = [educationCardRef.current, experienceCardRef.current, 
                      skillsCardRef.current, interestsCardRef.current].filter(Boolean);
        
        masterTimeline.to(cards, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.8);
        
        // Scroll-triggered parallax effect for 3D model
        if (sectionRef.current && modelContainerRef.current) {
          gsap.to(modelContainerRef.current, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            },
            y: -50,
            rotation: 0.1
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
      className="relative min-h-screen w-full py-24 text-white bg-zinc-900 overflow-hidden"
    >
      {/* About Title with accent line */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex items-center space-x-4 mb-2">
          <div className="h-px w-12 bg-stone-400 opacity-70"></div>
          <span className="text-stone-400 font-light uppercase text-sm tracking-widest">About</span>
        </div>
        <h2 
          ref={aboutTitleRef} 
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider text-stone-300 font-['Manrope'] uppercase relative inline-block"
        >
          Who I Am
          <div className="absolute -bottom-3 left-0 h-1 w-1/3 bg-gradient-to-r from-zinc-400 to-transparent"></div>
        </h2>
        
        <div className="mt-20 flex flex-col lg:flex-row gap-16">
          {/* Content container */}
          <div className="lg:w-7/12 relative z-10">
            {/* Bio section with gradient border */}
            <div className="relative p-6 rounded-lg bg-gradient-to-br from-zinc-800/80 to-zinc-800/30 backdrop-blur-md overflow-hidden mb-16 border-l-2 border-stone-700">
              {/* Abstract ornament in the background */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M50.9,-60.2C66.7,-50.5,80.5,-35.4,85.8,-17.6C91,0.2,87.8,20.7,77.9,36.1C68,51.5,51.2,61.8,33.8,69.3C16.4,76.9,-1.6,81.7,-18.5,77.8C-35.3,73.9,-51,61.4,-62.3,45.6C-73.6,29.9,-80.6,10,-78.8,-8.9C-77.1,-27.8,-66.6,-45.6,-51.2,-55.7C-35.8,-65.8,-15.4,-68.2,1.5,-70C18.4,-71.8,35.1,-69.9,50.9,-60.2Z" transform="translate(100 100)" />
                </svg>
              </div>
            
              <div className="relative">
                <h3 className="text-xl text-stone-300 font-['Manrope'] mb-5">
                  <span className="inline-block bg-stone-700/50 px-2 rounded">Full Stack Developer</span>
                </h3>
                
                <p 
                  ref={descriptionRef} 
                  className="text-base md:text-lg font-['Manrope'] text-stone-400 leading-relaxed font-light"
                >
                  <span className="block mb-4">I am a forward-thinking full stack developer with a passion for creating elegant, user-centered digital experiences. My approach combines technical precision with creative problem-solving, resulting in applications that are both functional and aesthetically pleasing.</span>
                  <span className="block mb-4">I thrive in collaborative environments where I can leverage my skills in both front-end and back-end technologies to build comprehensive solutions.</span>
                  <span className="block">My goal is to craft digital experiences that not only meet technical requirements but also delight users with their intuitive design and seamless functionality.</span>
                </p>
              </div>
            </div>
            
            {/* Cards Container - Grid with 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education Card */}
              <div 
                ref={educationCardRef} 
                className="bg-zinc-800/50 backdrop-blur-sm border-l-2 border-zinc-700 rounded-lg p-6 hover:border-zinc-500 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-zinc-700/20 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                
                <h3 className="text-lg font-['Manrope'] uppercase tracking-wider text-stone-300 mb-5 flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  Education
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="border-l border-zinc-700 pl-4 py-1">
                    <p className="text-lg font-['Manrope'] text-stone-300">Master of Computer Applications</p>
                    <p className="text-sm font-['Manrope'] text-stone-400 mt-1">2023 - 2025</p>
                  </div>
                  
                  <div className="flex items-center mt-4 border-t border-zinc-700/50 pt-4">
                    <div className="flex items-center justify-center text-lg font-medium text-stone-300">
                      8.0 SGPA
                    </div>
                    <div className="ml-4 w-full bg-zinc-700/30 rounded-full h-2">
                      <div className="bg-stone-500 h-2 rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Experience Card */}
              <div 
                ref={experienceCardRef} 
                className="bg-zinc-800/50 backdrop-blur-sm border-l-2 border-zinc-700 rounded-lg p-6 hover:border-zinc-500 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-zinc-700/20 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                
                <h3 className="text-lg font-['Manrope'] uppercase tracking-wider text-stone-300 mb-5 flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  Experience
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="border-l border-zinc-700 pl-4 py-1">
                    <p className="text-lg font-['Manrope'] text-stone-300">Web Developer Intern</p>
                    <p className="text-sm font-['Manrope'] text-stone-400 mt-1">Jul 2023 - Sep 2023</p>
                    <p className="text-sm font-['Manrope'] text-stone-400 mt-1 flex items-center">
                      <span className="inline-block w-2 h-2 bg-stone-500 rounded-full mr-2"></span>
                      Dynamisers Solutions
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-4 border-t border-zinc-700/50 pt-4">
                    <span className="text-xs uppercase tracking-wider px-2 py-1 rounded bg-stone-700/70 text-stone-300">
                      3 Months
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Skills Card */}
              <div 
                ref={skillsCardRef} 
                className="bg-zinc-800/50 backdrop-blur-sm border-l-2 border-zinc-700 rounded-lg p-6 hover:border-zinc-500 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-zinc-700/20 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                
                <h3 className="text-lg font-['Manrope'] uppercase tracking-wider text-stone-300 mb-5 flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  Skills
                </h3>
                
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {["React", "Node.js", "TypeScript", "MongoDB", "GraphQL", "Tailwind"].map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
                      <span className="text-stone-300 font-['Manrope'] text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
                
                <div className="relative z-10 mt-4 pt-4 border-t border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-stone-400">Frontend</span>
                    <span className="text-xs text-stone-400">85%</span>
                  </div>
                  <div className="w-full bg-zinc-700/30 rounded-full h-1.5">
                    <div className="bg-stone-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2 mt-3">
                    <span className="text-xs uppercase tracking-wider text-stone-400">Backend</span>
                    <span className="text-xs text-stone-400">75%</span>
                  </div>
                  <div className="w-full bg-zinc-700/30 rounded-full h-1.5">
                    <div className="bg-stone-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Interests Card */}
              <div 
                ref={interestsCardRef} 
                className="bg-zinc-800/50 backdrop-blur-sm border-l-2 border-zinc-700 rounded-lg p-6 hover:border-zinc-500 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-zinc-700/20 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                
                <h3 className="text-lg font-['Manrope'] uppercase tracking-wider text-stone-300 mb-5 flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  Interests
                </h3>
                
                <div className="flex flex-wrap gap-2 relative z-10">
                  {["UI/UX Design", "3D Modeling", "AI", "Open Source", "Gaming", "Photography"].map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-zinc-700/50 text-stone-300 rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-700/50 relative z-10">
                  <p className="text-sm italic text-stone-400">
                    "Always exploring new technologies and creative ways to solve problems."
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3D Object Container */}
          <div className="lg:w-5/12 flex justify-center lg:justify-start items-center lg:items-start relative">
            <div className="w-full max-w-sm relative">
              <div 
                ref={modelContainerRef} 
                className="w-64 h-64 md:w-96 md:h-96 relative mx-auto"
              >
                {/* Three.js will inject the canvas here */}
                {/* Decorative rings around the 3D model */}
                <div className="absolute inset-0 -m-6 border border-zinc-700/30 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 -m-12 border border-zinc-700/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute inset-0 -m-20 border border-zinc-700/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              
              {/* Stats cards positioned around the 3D model */}
              <div className="absolute top-4 right-4 bg-zinc-800/70 backdrop-blur-sm px-3 py-2 rounded border-l border-zinc-700 text-stone-300 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse"></div>
                  <span>3+ Years Coding</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-zinc-800/70 backdrop-blur-sm px-3 py-2 rounded border-l border-zinc-700 text-stone-300 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse"></div>
                  <span>10+ Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* More interesting background elements */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVGhD7dixDoJAEEXRWVt7/v9LbS2hILtmE9LQkZmQc5JbUbw3hYWZ2Sikj9PLrA9HB27HjqRWJfJTOmtVIpv0bFUiKW9WJZLmzapEcilNViWS82ZVIrl81qpEyvRZqxIp88+qRMr88xkp071ZlUjum1WJ5Ly1KpFcPluVSMmbVYmk6VmrEknTs1YlkrIqEbP/tus+et3eGZP09x8AAAAASUVORK5CYII=')] opacity-5 z-0"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
      
      {/* Geometric accents */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-zinc-700 rounded-full opacity-20 z-0 animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-zinc-700 rounded-full opacity-10 z-0 animate-pulse" style={{animationDuration: '12s'}}></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border border-zinc-700 opacity-30 z-0 transform rotate-45"></div>
      
      {/* Glow effect in one corner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800 rounded-full filter blur-[120px] opacity-20 z-0"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900 opacity-50 z-0"></div>
    </section>
  );
};

export default AboutSection;