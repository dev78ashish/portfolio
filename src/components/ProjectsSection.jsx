import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowLeft, Github, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Sample project data - replace with your actual projects
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React, Node.js and MongoDB",
    image: "/project1.jpg", // Replace with your actual image paths
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    github: "https://github.com/username/project1",
    liveDemo: "https://project1demo.com"
  },
  {
    id: 2,
    title: "AI Content Generator",
    description: "Content generation tool powered by machine learning algorithms",
    image: "/project2.jpg",
    technologies: ["Python", "TensorFlow", "React", "Firebase"],
    github: "https://github.com/username/project2",
    liveDemo: "https://project2demo.com"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Personal portfolio with interactive 3D elements and animations",
    image: "/project3.jpg",
    technologies: ["React", "Three.js", "GSAP", "Tailwind CSS"],
    github: "https://github.com/username/project3",
    liveDemo: "https://project3demo.com"
  },
  {
    id: 4,
    title: "Social Media Dashboard",
    description: "Analytics dashboard for social media management and tracking",
    image: "/project4.jpg",
    technologies: ["Vue.js", "D3.js", "Node.js", "PostgreSQL"],
    github: "https://github.com/username/project4",
    liveDemo: "https://project4demo.com"
  },
  {
    id: 5,
    title: "Real-time Chat App",
    description: "Secure messaging application with end-to-end encryption",
    image: "/project5.jpg",
    technologies: ["React Native", "Socket.io", "Express", "MongoDB"],
    github: "https://github.com/username/project5",
    liveDemo: "https://project5demo.com"
  }
];

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const projectRefs = useRef([]);
  const pinWrapperRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initAnimations = async () => {
      try {
        // Dynamically import SplitType
        const SplitTypeModule = await import('split-type');
        const SplitType = SplitTypeModule.default;
        
        if (!titleRef.current) return;
        
        // Split title for animations
        const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
        
        // Initialize animation for title
        gsap.set(titleSplit.chars, { opacity: 0, y: 50 });
        
        // Create timeline for title animation
        const titleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
        
        titleTimeline.to(titleSplit.chars, {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: 'power3.out'
        });
        
        // Project cards animation
        projectRefs.current.forEach((projectRef, index) => {
          gsap.set(projectRef, {
            opacity: 0,
            y: 50
          });
          
          gsap.to(projectRef, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2 + (index * 0.1)
          });
        });
        
        // Setup horizontal scrolling with pinning
        if (trackRef.current && sliderRef.current && pinWrapperRef.current) {
          const newSliderWidth = sliderRef.current.clientWidth;
          const newTrackWidth = trackRef.current.scrollWidth;
          
          setSliderWidth(newSliderWidth);
          setTrackWidth(newTrackWidth);
          
          // Clear any existing ScrollTriggers to avoid duplicates
          ScrollTrigger.getAll().forEach(t => t.kill());
          
          // Create horizontal scroll effect with pinning
          const scrollTween = gsap.to(trackRef.current, {
            x: () => -(newTrackWidth - newSliderWidth),
            ease: "none",
            scrollTrigger: {
              trigger: pinWrapperRef.current,
              pin: true,                     // Pin the section
              scrub: 1,                      // Smooth scrubbing
              start: "top top",              // Start at the top of the viewport
              end: () => `+=${newTrackWidth}`, // End after scrolling the width of the track
              invalidateOnRefresh: true,     // Recalculate on resize
              anticipatePin: 1,
              onUpdate: (self) => {
                // Update progress bar
                if (progressRef.current) {
                  gsap.to(progressRef.current, {
                    width: `${self.progress * 100}%`,
                    duration: 0.1
                  });
                  
                  // Calculate active project index
                  const newIndex = Math.min(
                    Math.floor(self.progress * projects.length),
                    projects.length - 1
                  );
                  setActiveIndex(newIndex);
                }
              }
            }
          });
          
          return () => {
            scrollTween.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          };
        }
      } catch (error) {
        console.error('Animation setup error:', error);
      }
    };
    
    initAnimations();
    
    const handleResize = () => {
      if (trackRef.current && sliderRef.current) {
        setSliderWidth(sliderRef.current.clientWidth);
        setTrackWidth(trackRef.current.scrollWidth);
        
        // Refresh all ScrollTriggers on resize
        ScrollTrigger.refresh();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted]);

  const scrollProject = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, projects.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    setActiveIndex(newIndex);
    
    if (trackRef.current && sliderRef.current) {
      const projectWidth = trackWidth / projects.length;
      const targetX = -projectWidth * newIndex;
      
      gsap.to(trackRef.current, {
        x: Math.max(-(trackWidth - sliderWidth), targetX),
        duration: 0.8,
        ease: "power3.out"
      });
      
      // Update progress bar
      gsap.to(progressRef.current, {
        width: `${(newIndex / (projects.length - 1)) * 100}%`,
        duration: 0.8
      });
      
      // Also update the ScrollTrigger's scroll position
      const scrollTrigger = ScrollTrigger.getById("projects-pin");
      if (scrollTrigger) {
        const progress = newIndex / (projects.length - 1);
        const scrollPosition = scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * progress;
        window.scrollTo(0, scrollPosition);
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full text-white bg-zinc-900 overflow-hidden"
    >
      {/* Projects Title with accent line - Outside the pinned section */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 py-24">
        <div className="flex items-center space-x-4 mb-2">
          <div className="h-px w-12 bg-stone-400 opacity-70"></div>
          <span className="text-stone-400 font-light uppercase text-sm tracking-widest">Projects</span>
        </div>
        <h2 
          ref={titleRef} 
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-wider text-stone-300 font-['Manrope'] uppercase relative inline-block mb-16"
        >
          My Work
          <div className="absolute -bottom-3 left-0 h-1 w-1/3 bg-gradient-to-r from-zinc-400 to-transparent"></div>
        </h2>
      </div>
      
      {/* Pinned section for horizontal scrolling */}
      <div 
        ref={pinWrapperRef} 
        className="w-full relative z-10" 
        style={{ height: '100vh' }} // Fixed height for the pinned section
      >
        {/* Navigation Controls */}
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center mb-6">
          <div className="text-stone-300 font-light">
            <span className="text-2xl">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-stone-500 text-lg"> / {String(projects.length).padStart(2, '0')}</span>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => scrollProject('prev')}
              disabled={activeIndex === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-stone-700 transition-all ${
                activeIndex === 0 ? 'text-stone-600 cursor-not-allowed' : 'text-stone-300 hover:border-stone-400 hover:text-white'
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={() => scrollProject('next')}
              disabled={activeIndex === projects.length - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-stone-700 transition-all ${
                activeIndex === projects.length - 1 ? 'text-stone-600 cursor-not-allowed' : 'text-stone-300 hover:border-stone-400 hover:text-white'
              }`}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="container mx-auto px-6 md:px-12 mb-8">
          <div className="h-0.5 bg-stone-800 w-full rounded">
            <div ref={progressRef} className="h-full bg-stone-400 rounded transition-all duration-300" style={{ width: `${(activeIndex / (projects.length - 1)) * 100}%` }}></div>
          </div>
        </div>
        
        {/* Projects Horizontal Slider */}
        <div 
          ref={sliderRef}
          className="w-full overflow-hidden h-[calc(100vh-120px)]" // Adjust the height to leave space for navigation
        >
          <div 
            ref={trackRef}
            className="flex gap-6 px-6 md:px-12 transition-transform will-change-transform h-full"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={el => (projectRefs.current[index] = el)}
                className={`flex-shrink-0 group ${
                  activeIndex === index ? 'scale-[1.02] duration-300' : ''
                }`}
                style={{ width: '80vw', maxWidth: '1000px' }}
              >
                <div className="bg-zinc-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-zinc-600 h-full flex flex-col">
                  {/* Project Image with Overlay */}
                  <div className="relative overflow-hidden h-[60vh] max-h-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-70 z-10"></div>
                    <div 
                      className="w-full h-full bg-zinc-800 bg-opacity-40 group-hover:scale-105 transition-transform duration-1000"
                      style={{
                        backgroundImage: `url(${project.image || `/api/placeholder/1000/600?text=Project+${index + 1}`})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                    
                    {/* Project Title (Absolute Positioned over image) */}
                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                      <h3 className="text-3xl md:text-4xl font-medium tracking-wider text-white mb-3 group-hover:transform group-hover:-translate-y-2 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-lg text-stone-300 opacity-90 mb-4 max-w-[600px] group-hover:transform group-hover:-translate-y-2 transition-transform duration-300 delay-75">
                        {project.description}
                      </p>
                      
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 group-hover:transform group-hover:-translate-y-2 transition-transform duration-300 delay-100">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-zinc-700/70 backdrop-blur-sm text-stone-300 rounded-full text-xs font-light"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Links & CTA */}
                  <div className="px-8 py-6 flex justify-between items-center bg-gradient-to-r from-zinc-800/80 to-zinc-800/40 backdrop-blur-sm">
                    <div className="flex space-x-4">
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-stone-400 hover:text-white transition-colors duration-300"
                      >
                        <Github size={18} />
                        <span className="text-sm font-light">Code</span>
                      </a>
                      <a 
                        href={project.liveDemo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-stone-400 hover:text-white transition-colors duration-300"
                      >
                        <ExternalLink size={18} />
                        <span className="text-sm font-light">Live Demo</span>
                      </a>
                    </div>
                    
                    {/* Indicator for current slide */}
                    <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                      activeIndex === index ? 'bg-stone-300' : 'bg-stone-700'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Project Description for Active Project - Mobile Friendly */}
        <div className="container mx-auto px-6 md:px-12 mt-8 md:hidden">
          <div className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-stone-300 mb-2">
              {projects[activeIndex].title}
            </h3>
            <p className="text-sm text-stone-400 mb-4">
              {projects[activeIndex].description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {projects[activeIndex].technologies.map((tech, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 bg-zinc-700/70 text-stone-300 rounded-full text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex space-x-4">
              <a 
                href={projects[activeIndex].github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-stone-400 hover:text-white transition-colors"
              >
                <Github size={16} />
                <span className="text-xs">Code</span>
              </a>
              <a 
                href={projects[activeIndex].liveDemo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-stone-400 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
                <span className="text-xs">Live Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content after horizontal scrolling - continues vertical scrolling */}
      <div className="container mx-auto px-6 md:px-12 py-24 relative z-10">
        <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-8 border border-zinc-700">
          <h3 className="text-2xl md:text-3xl font-medium tracking-wider text-stone-300 mb-6">
            About My Projects
          </h3>
          <p className="text-stone-400 mb-4">
            These projects represent my journey as a developer, showcasing my skills in various technologies and problem domains. Each project has been carefully crafted to solve real-world challenges while implementing best practices in software development.
          </p>
          <p className="text-stone-400">
            I'm always working on new ideas and improving my existing projects. Feel free to reach out if you'd like to collaborate or have any questions about my work.
          </p>
        </div>
      </div>
      
      {/* Background Elements (Similar to About section for consistency) */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVGhD7dixDoJAEEXRWVt7/v9LbS2hILtmE9LQkZmQc5JbUbw3hYWZ2Sikj9PLrA9HB27HjqRWJfJTOmtVIpv0bFUiKW9WJZLmzapEcilNViWS82ZVIrl81qpEyvRZqxIp88+qRMr88xkp071ZlUjum1WJ5Ly1KpFcPluVSMmbVYmk6VmrEknTs1YlkrIqEbP/tus+et3eGZP09x8AAAAASUVORK5CYII=')] opacity-5 z-0"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
      
      {/* Geometric accents */}
      <div className="absolute top-40 left-20 w-48 h-48 border border-zinc-700 rounded-full opacity-10 z-0 animate-pulse" style={{animationDuration: '15s'}}></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-zinc-700 opacity-10 z-0 transform rotate-45"></div>
      
      {/* Glow effect in one corner */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-800 rounded-full filter blur-[120px] opacity-20 z-0"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900 opacity-60 z-0"></div>
    </section>
  );
};

export default ProjectsSection;