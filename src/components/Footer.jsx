import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Instagram, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const contactRef = useRef(null);
  const linksRef = useRef(null);
  const copyrightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations on load
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        contactRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out" }
      );

      gsap.fromTo(
        linksRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        copyrightRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" }
      );

      // Hover animations for social links
      const socialLinks = document.querySelectorAll('.social-link');
      socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          gsap.to(link, { scale: 1.1, duration: 0.3, ease: "power1.out" });
        });
        
        link.addEventListener('mouseleave', () => {
          gsap.to(link, { scale: 1, duration: 0.3, ease: "power1.out" });
        });
      });

      // Button hover animation
      const contactButton = document.querySelector('.contact-button');
      contactButton.addEventListener('mouseenter', () => {
        gsap.to(contactButton, { backgroundColor: '#222', scale: 1.03, duration: 0.3 });
      });
      
      contactButton.addEventListener('mouseleave', () => {
        gsap.to(contactButton, { backgroundColor: '#000', scale: 1, duration: 0.3 });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-black text-white py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side */}
        <div className="space-y-8">
          <div ref={logoRef} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-2 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-black">
                  <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM9.5,16.5h0a4.5,4.5,0,0,1,0-9h5v9ZM14.5,12h-5a1.5,1.5,0,0,0,0,3h5Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Devashish Prasad</h3>
            </div>
          </div>
          
          <div ref={formRef}>
            <h3 className="text-lg mb-2">Have a question or project in mind?</h3>
            <a href="mailto:hello@devashish.design" className="text-2xl md:text-3xl font-bold border-b-2 border-white inline-block hover:text-gray-300 transition-colors">
              hello@devashish.design
            </a>
          </div>
          
          <div ref={linksRef} className="flex flex-col md:flex-row gap-4 md:gap-8 pt-4">
            <div className="social-link cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Instagram size={20} /> 
              <span className="text-sm">Instagram</span>
              <ExternalLink size={16} />
            </div>
            <div className="social-link cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Linkedin size={20} /> 
              <span className="text-sm">LinkedIn</span>
              <ExternalLink size={16} />
            </div>
            <div className="social-link cursor-pointer flex items-center gap-2 hover:text-gray-300 transition-colors">
              <Mail size={20} /> 
              <span className="text-sm">Email</span>
              <ExternalLink size={16} />
            </div>
          </div>
          
          <div>
            <p className="text-gray-400">
              23 Maple Avenue<br />
              New Delhi, India
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="form-container">
              <div className="mb-4">
                <input type="text" placeholder="Company name" className="w-full bg-transparent border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:border-white transition-colors" />
              </div>
              <div className="mb-4">
                <input type="email" placeholder="E-mail" className="w-full bg-transparent border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:border-white transition-colors" />
              </div>
              
              <div className="flex items-center mt-4 mb-6">
                <div className="mr-2">
                  <input type="checkbox" id="terms" className="w-4 h-4 border-gray-600 rounded" />
                </div>
                <label htmlFor="terms" className="text-sm">
                  I accept the <span className="underline cursor-pointer">Terms and Conditions</span>
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                <button ref={contactRef} className="contact-button bg-black text-white border border-white rounded-md px-6 py-4 font-medium hover:bg-gray-900 transition-all">
                  Contact me
                </button>
                <p className="text-xs text-gray-400 mt-4 sm:mt-0 sm:ml-4">
                  This site is protected by reCAPTCHA and the Google <span className="underline cursor-pointer">Privacy Policy</span> and <span className="underline cursor-pointer">Terms of Service</span> apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div ref={copyrightRef} className="container mx-auto px-6 mt-16 flex flex-col md:flex-row justify-between items-start md:items-center text-gray-400 text-sm">
        <div>
          2025 © DEVASHISH PRASAD
        </div>
        <div>
          CREATED WITH ❤️ BY DEVASHISH
        </div>
      </div>
      
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-60 h-60 rounded-full bg-gradient-to-r from-blue-400 to-teal-600 blur-3xl -bottom-40 -right-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </footer>
  );
};

export default Footer;