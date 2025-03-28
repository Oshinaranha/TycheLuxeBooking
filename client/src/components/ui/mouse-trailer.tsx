import { useEffect, useRef } from 'react';

export function MouseTrailer() {
  const trailerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const trailer = trailerRef.current;
    if (!trailer) return;
    
    // Smooth animation with lerp
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Show the trailer when mouse moves
      trailer.style.opacity = '1';
      
      // Check for interactive elements to scale the trailer
      const target = e.target as HTMLElement;
      if (target.closest('a') || 
          target.closest('button') || 
          target.closest('.magic-button') || 
          target.closest('.magic-border') ||
          target.classList.contains('interactive')) {
        trailer.style.width = '64px';
        trailer.style.height = '64px';
        trailer.style.borderColor = 'rgba(212, 175, 55, 0.7)';
        trailer.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
      } else {
        trailer.style.width = '32px';
        trailer.style.height = '32px';
        trailer.style.borderColor = 'rgba(212, 175, 55, 0.4)';
        trailer.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
      }
    };
    
    const handleMouseOut = () => {
      trailer.style.opacity = '0';
    };
    
    // Animation loop with lerp smoothing
    const animateTrailer = () => {
      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
      };
      
      posX = lerp(posX, mouseX, 0.1);
      posY = lerp(posY, mouseY, 0.1);
      
      trailer.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
      
      requestAnimationFrame(animateTrailer);
    };
    
    // Mobile detection - don't show on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseout', handleMouseOut);
      animateTrailer();
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  
  return <div ref={trailerRef} className="mouse-trailer" />;
}