import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0D0D0D, 0.3);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.set(0, 0, 5);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const goldLight = new THREE.PointLight(0xD4AF37, 1, 10);
    goldLight.position.set(-2, 1, 2);
    scene.add(goldLight);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = isMobile ? 1000 : 3000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    // Fill arrays with random positions and scales
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position in a sphere
      const radius = 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      posArray[i + 2] = radius * Math.cos(phi);                   // z
      
      // Particle size variation
      scaleArray[i / 3] = Math.random() * 2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    
    // Create points
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Gold accent geometry
    const goldRingGeometry = new THREE.TorusGeometry(2, 0.05, 16, 100);
    const goldMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xD4AF37,
      emissive: 0xD4AF37,
      emissiveIntensity: 0.4,
      metalness: 1,
      roughness: 0.3
    });
    
    const goldRing = new THREE.Mesh(goldRingGeometry, goldMaterial);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.rotation.z = Math.PI / 4;
    scene.add(goldRing);
    
    // Animate the ring
    gsap.to(goldRing.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    // Animate particles
    const clock = new THREE.Clock();
    
    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement effect
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      gsap.to(particlesMesh.rotation, {
        x: mouse.y * 0.05,
        y: mouse.x * 0.05,
        duration: 1
      });
      
      gsap.to(goldRing.rotation, {
        x: Math.PI / 2 + mouse.y * 0.1,
        z: Math.PI / 4 + mouse.x * 0.1,
        duration: 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Slight continuous rotation
      particlesMesh.rotation.y = elapsedTime * 0.05;
      
      // Pulsating effect
      particlesMaterial.size = 0.025 + Math.sin(elapsedTime) * 0.01;
      
      // Render
      renderer.render(scene, camera);
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      goldRingGeometry.dispose();
      goldMaterial.dispose();
    };
  }, [isMobile]);
  
  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}