import { useRef, useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MagicButtonProps extends ButtonProps {
  glowColor?: string;
  hoverScale?: number;
  children: React.ReactNode;
}

export function MagicButton({
  glowColor = 'rgba(212, 175, 55, 0.4)',
  hoverScale = 1.05,
  className,
  children,
  ...props
}: MagicButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for the spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const { left, top, width, height } = button.getBoundingClientRect();
    
    // Calculate relative position inside the button
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Set the position for the spotlight gradient
    setMousePosition({ x: (x / width) * 100, y: (y / height) * 100 });
  };

  // Prevent effects on mobile
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setIsHovered(false);
    }
  }, []);

  return (
    <Button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden magic-button',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
        boxShadow: isHovered ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}` : `0 0 10px ${glowColor}`,
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
      }}
      {...props}
    >
      {/* Spotlight gradient effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)`,
            mixBlendMode: 'soft-light',
          }}
        />
      )}
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
      
      {/* Gold border glow on hover */}
      <div className={cn(
        "absolute inset-0 border border-gold/40 rounded-md pointer-events-none transition-opacity",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </Button>
  );
}