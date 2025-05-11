import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all animations for the site
 */
export const initAnimations = () => {
  // Set up standard reveal animations for common elements
  setupRevealAnimations();
  
  // Set up scroll-triggered animations
  setupScrollAnimations();
};

/**
 * Set up reveal animations for elements that should animate
 * as they enter the viewport
 */
const setupRevealAnimations = () => {
  // Fade in animation for sections
  const fadeInSections = document.querySelectorAll('.fade-in');
  fadeInSections.forEach(section => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        }
      }
    );
  });
};

/**
 * Set up animations that trigger on scroll
 */
const setupScrollAnimations = () => {
  // Create parallax effect for background elements
  const parallaxElements = document.querySelectorAll('.parallax');
  parallaxElements.forEach(element => {
    gsap.to(element, {
      y: '20%',
      ease: 'none',
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
  
  // Animate rotating elements
  const rotatingElements = document.querySelectorAll('.rotate-on-scroll');
  rotatingElements.forEach(element => {
    gsap.to(element, {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
};