import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * AnimatedButton component with hover effects
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant ('primary', 'outline', 'ghost')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {string} props.href - Optional URL for anchor tag
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  onClick, 
  className = '',
  ...props 
}) => {
  const buttonRef = useRef(null);
  const magneticRef = useRef(null);
  
  // Define variant classes
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-white/90',
    outline: 'border border-white text-white hover:bg-white/10',
    ghost: 'text-white hover:bg-white/5'
  };
  
  // Define size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  // Calculate the combined class string
  const combinedClasses = `relative flex items-center justify-center gap-2 font-medium transition-all duration-300 overflow-hidden ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const magnetic = magneticRef.current;
    
    // Create hover enter animation
    const handleMouseEnter = () => {
      // Create animated underline effect
      if (variant === 'outline' || variant === 'ghost') {
        gsap.fromTo(
          button.querySelector('.button-underline'),
          { 
            scaleX: 0, 
            transformOrigin: 'left' 
          },
          { 
            scaleX: 1, 
            duration: 0.4, 
            ease: 'power2.out' 
          }
        );
      }
      
      // Create hover state
      gsap.to(button, { 
        scale: 1.02, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
      
      // Add magnetic effect listener
      if (magnetic) {
        window.addEventListener('mousemove', handleMagneticMove);
      }
    };
    
    // Create hover exit animation
    const handleMouseLeave = () => {
      // Animate underline out
      if (variant === 'outline' || variant === 'ghost') {
        gsap.to(
          button.querySelector('.button-underline'),
          { 
            scaleX: 0, 
            transformOrigin: 'right', 
            duration: 0.3, 
            ease: 'power2.in' 
          }
        );
      }
      
      // Reset hover state
      gsap.to(button, { 
        scale: 1, 
        x: 0, 
        y: 0, 
        duration: 0.4, 
        ease: 'elastic.out(1, 0.3)' 
      });
      
      // Remove magnetic effect listener
      if (magnetic) {
        window.removeEventListener('mousemove', handleMagneticMove);
      }
    };
    
    // Create magnetic movement effect
    const handleMagneticMove = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Calculate distance from cursor to center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Calculate movement (stronger effect for ghost buttons)
      const strength = variant === 'ghost' ? 0.3 : 0.1;
      const moveX = distanceX * strength;
      const moveY = distanceY * strength;
      
      // Apply movement
      gsap.to(button, { 
        x: moveX, 
        y: moveY, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    };
    
    // Add event listeners
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMagneticMove);
    };
  }, [variant]);
  
  // Render as anchor or button
  const ButtonTag = href ? 'a' : 'button';
  const buttonProps = href ? { href, ...props } : { onClick, ...props };
  
  return (
    <div ref={magneticRef} className="inline-block">
      <ButtonTag 
        ref={buttonRef} 
        className={combinedClasses} 
        {...buttonProps}
      >
        {children}
        {(variant === 'outline' || variant === 'ghost') && (
          <span className="button-underline absolute bottom-1 left-2 right-2 h-[1px] bg-white transform scale-x-0" />
        )}
      </ButtonTag>
    </div>
  );
};

export default AnimatedButton;