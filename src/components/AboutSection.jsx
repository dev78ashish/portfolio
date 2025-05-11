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
    
    // Create abstract geometric shape (icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    
    // Create a wireframe material
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8A8A8A,
      wireframe: true
    });
    
    // Create the solid material with a subtle glow
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x3A3A3A,
      shininess: 60,
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
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add point light for glow effect
    const pointLight = new THREE.PointLight(0xCCCCCC, 1, 100);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Optional: add orbit controls for interactive rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Create animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
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
        
        if (!aboutTitleRef.current || !descriptionRef.current || 
            !educationCardRef.current || !experienceCardRef.current) {
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
        gsap.set(educationCardRef.current, { opacity: 0, y: 50 });
        gsap.set(experienceCardRef.current, { opacity: 0, y: 50 });
        
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
        
        // Education card animation
        masterTimeline.to(educationCardRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }, 0.8);
        
        // Experience card animation
        masterTimeline.to(experienceCardRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }, 1);
        
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
      {/* About Title */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <h2 
          ref={aboutTitleRef} 
          className="text-3xl md:text-4xl font-medium tracking-wider text-stone-300 font-['Manrope'] uppercase"
        >
          About Me
        </h2>
        
        <div className="mt-16 flex flex-col lg:flex-row gap-12">
          {/* Description */}
          <div className="lg:w-7/12 relative z-10">
            <p 
              ref={descriptionRef} 
              className="text-base md:text-lg font-['Manrope'] text-stone-400 leading-relaxed font-light"
            >
              <span className="block">I am a forward-thinking full stack developer with a passion</span>
              <span className="block">for creating elegant, user-centered digital experiences. My</span>
              <span className="block">approach combines technical precision with creative problem-</span>
              <span className="block">solving, resulting in applications that are both functional</span>
              <span className="block">and aesthetically pleasing. I thrive in collaborative</span>
              <span className="block">environments where I can leverage my skills in both front-end</span>
              <span className="block">and back-end technologies to build comprehensive solutions.</span>
              <span className="block">My goal is to craft digital experiences that not only meet</span>
              <span className="block">technical requirements but also delight users with their</span>
              <span className="block">intuitive design and seamless functionality.</span>
            </p>
            
            {/* Cards Container */}
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              {/* Education Card */}
              <div 
                ref={educationCardRef} 
                className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300"
              >
                <h3 className="text-lg font-['Manrope'] uppercase tracking-wider text-stone-300 mb-4">Education</h3>
                <div className="space-y-2">
                  <p className="text-lg font-['Manrope'] text-stone-300">Master of Computer Applications</p>
                  <p className="text-sm font-['Manrope'] text-stone-400">2023 - 2025</p>
                  <div className="flex items-center mt-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                    <p className="ml-3 text-stone-300 font-['Manrope']">8.0 SGPA</p>
                  </div>
                </div>
              </div>
              
              {/* Experience Card */}
              <div 
                ref={experienceCardRef} 
                className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300"
              >
                <h3 className="text-lg font-['Manrope'] uppercase tracking-wider text-stone-300 mb-4">Experience</h3>
                <div className="space-y-2">
                  <p className="text-lg font-['Manrope'] text-stone-300">Web Developer Intern</p>
                  <p className="text-sm font-['Manrope'] text-stone-400">Jul 2023 - Sep 2023</p>
                  <div className="flex items-center mt-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded bg-stone-700/50 text-stone-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                    </div>
                    <p className="ml-3 text-stone-300 font-['Manrope']">Dynamisers Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3D Object Container */}
          <div className="lg:w-5/12 flex justify-center items-center lg:items-start relative">
            <div 
              ref={modelContainerRef} 
              className="w-64 h-64 md:w-80 md:h-80 lg:absolute lg:-right-12 lg:top-0"
            >
              {/* Three.js will inject the canvas here */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVGhD7dixDoJAEEXRWVt7/v9LbS2hILtmE9LQkZmQc5JbUbw3hYWZ2Sikj9PLrA9HB27HjqRWJfJTOmtVIpv0bFUiKW9WJZLmzapEcilNViWS82ZVIrl81qpEyvRZqxIp88+qRMr88xkp071ZlUjum1WJ5Ly1KpFcPluVSMmbVYmk6VmrEknTs1YlkrIqEbP/tus+et3eGZP09x8AAAAASUVORK5CYII=')] opacity-5 z-0"></div>
      
      {/* Geometric accents */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-zinc-700 rounded-full opacity-20 z-0"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-zinc-700 rounded-full opacity-20 z-0"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border border-zinc-700 opacity-20 z-0 transform rotate-45"></div>
    </section>
  );
};

export default AboutSection;