import { forwardRef, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: 'portrait' | 'square' | 'video' | 'wide';
  glowColor?: string;
  rotation?: number;
  children: React.ReactNode;
}

export const MagicCard = forwardRef<HTMLDivElement, MagicCardProps>(({ 
  aspectRatio = 'portrait', 
  glowColor = 'rgba(212, 175, 55, 0.3)',
  rotation = 5,
  className, 
  children, 
  ...props 
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  // Dynamic aspect ratio classes
  const aspectRatioClasses = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[2/1]',
  };

  // Handle mouse movement to create 3D rotation effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    
    // Calculate cursor position relative to the card center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on cursor position
    // Limit max rotation with the rotation prop
    const rX = (mouseY - centerY) / (height / 2) * rotation;
    const rY = (centerX - mouseX) / (width / 2) * rotation;
    
    setRotateX(rX);
    setRotateY(rY);
  };
  
  // Handle mouse enter to add scale effect
  const handleMouseEnter = () => {
    setScale(1.05);
  };
  
  // Handle mouse leave to reset rotation and scale
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };
  
  // Prevent 3D effect on mobile
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setRotateX(0);
      setRotateY(0);
    }
  }, []);
  
  return (
    <div
      ref={cardRef}
      className={cn(
        'magic-card bg-black/20 relative overflow-hidden rounded-xl border border-white/10',
        aspectRatioClasses[aspectRatio],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: 'transform 0.1s ease',
        boxShadow: `0 0 30px ${glowColor}`,
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-white/5 pointer-events-none" />
      {children}
    </div>
  );
});

MagicCard.displayName = "MagicCard";