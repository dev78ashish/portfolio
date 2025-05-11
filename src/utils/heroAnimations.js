import gsap from 'gsap';

/**
 * Initializes mouse-following animation for decorative elements
 * @param {HTMLElement} containerElement - The container element reference
 */
export const initMouseFollowAnimation = (containerElement) => {
  if (!containerElement) return;

  const floatingElements = containerElement.querySelectorAll('.floating-element');
  
  // Store initial positions
  const initialPositions = Array.from(floatingElements).map(el => {
    const rect = el.getBoundingClientRect();
    return {
      element: el,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  });
  
  // Mouse move handler
  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Animate each element based on mouse position
    initialPositions.forEach(item => {
      const { element, x, y } = item;
      
      // Calculate distance from mouse
      const distX = mouseX - x;
      const distY = mouseY - y;
      
      // Calculate movement amount (inverse distance relationship)
      // Elements that are farther away move less, creating parallax effect
      const moveX = distX * 0.03;
      const moveY = distY * 0.03;
      
      // Apply movement with GSAP
      gsap.to(element, {
        x: moveX,
        y: moveY,
        duration: 1, // Slow follow effect
        ease: 'power2.out'
      });
    });
  };
  
  // Add event listener
  containerElement.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    containerElement.removeEventListener('mousemove', handleMouseMove);
  };
};

/**
 * Creates a text reveal animation
 * @param {HTMLElement} textElement - The text element to animate
 * @param {Object} options - Animation options
 */
export const createTextRevealAnimation = (textElement, options = {}) => {
  if (!textElement) return;
  
  const {
    delay = 0,
    duration = 0.8,
    ease = 'power3.out',
    direction = 'up' // 'up' or 'down'
  } = options;
  
  // Split text if not already done
  let chars;
  if (textElement.children && textElement.children[0]?.classList?.contains('char')) {
    chars = textElement.children;
  } else {
    const splitType = new SplitType(textElement, { types: 'chars' });
    chars = splitType.chars;
  }
  
  // Create animation timeline
  const tl = gsap.timeline();
  
  // Set initial state
  gsap.set(chars, { 
    opacity: 0,
    y: direction === 'up' ? 100 : -100
  });
  
  // Animate each character
  tl.to(chars, { 
    opacity: 1, 
    y: 0, 
    duration, 
    ease, 
    stagger: 0.03,
    delay
  });
  
  return tl;
};

/**
 * Creates a scroll-triggered parallax effect for elements
 * @param {HTMLElement} container - The container to apply parallax to
 */
export const initParallaxScroll = (container) => {
  if (!container) return;
  
  const parallaxLayers = container.querySelectorAll('[data-parallax]');
  
  parallaxLayers.forEach(layer => {
    const speed = parseFloat(layer.getAttribute('data-parallax')) || 0.2;
    
    gsap.to(layer, {
      y: `${speed * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
};

/**
 * Creates a glitch effect for text
 * @param {HTMLElement} textElement - The text element to apply effect to
 */
export const createGlitchEffect = (textElement) => {
  if (!textElement) return;
  
  const content = textElement.textContent;
  const container = document.createElement('div');
  container.className = 'glitch-container relative';
  
  // Create base text
  const baseText = document.createElement('div');
  baseText.textContent = content;
  baseText.className = 'glitch-text';
  
  // Create glitch layers
  const layer1 = document.createElement('div');
  layer1.textContent = content;
  layer1.className = 'glitch-layer glitch-layer-1 absolute top-0 left-0 text-white opacity-0';
  
  const layer2 = document.createElement('div');
  layer2.textContent = content;
  layer2.className = 'glitch-layer glitch-layer-2 absolute top-0 left-0 text-white opacity-0';
  
  // Add elements to container
  container.appendChild(baseText);
  container.appendChild(layer1);
  container.appendChild(layer2);
  
  // Replace original element
  textElement.textContent = '';
  textElement.appendChild(container);
  
  // Create glitch animation timeline
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 5,
  });
  
  // Glitch animation
  tl.to(layer1, {
    duration: 0.1,
    opacity: 0.8,
    x: -3,
    skewX: 5,
    ease: 'power1.inOut'
  })
  .to(layer2, {
    duration: 0.1,
    opacity: 0.8,
    x: 3,
    skewX: -5,
    ease: 'power1.inOut'
  }, '<')
  .to([layer1, layer2], {
    duration: 0.1,
    opacity: 0,
    x: 0,
    skewX: 0,
    ease: 'power1.inOut'
  })
  .to(baseText, {
    duration: 0.01,
    opacity: 0.9,
    ease: 'power1.inOut'
  }, '<')
  .to(baseText, {
    duration: 0.01,
    opacity: 1,
    ease: 'power1.inOut'
  }, '>');
  
  return tl;
};