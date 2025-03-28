import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';

interface LuxuryVehicleModelProps {
  vehicleType: 'jet' | 'yacht' | 'helicopter' | 'car';
  className?: string;
}

export function LuxuryVehicleModel({ vehicleType, className = '' }: LuxuryVehicleModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only initialize when element is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, 
      (containerRef.current.clientWidth || 1) / (containerRef.current.clientHeight || 1), 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.set(0, 0, 5);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    const accentLight = new THREE.PointLight(0x00a8ff, 2, 10);
    accentLight.position.set(-2, 1, 1);
    scene.add(accentLight);
    
    // Create basic shape of vehicle
    let vehicleMesh: THREE.Mesh;
    
    const createVehicleMesh = () => {
      // Remove any existing vehicle mesh
      if (vehicleMesh) scene.remove(vehicleMesh);
      
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;
      
      // Create different geometry based on vehicle type
      switch (vehicleType) {
        case 'jet':
          // Create jet body
          const jetGroup = new THREE.Group();
          
          // Main body (fuselage)
          geometry = new THREE.CapsuleGeometry(0.4, 2, 10, 20);
          material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 0.8, 
            roughness: 0.2 
          });
          const fuselage = new THREE.Mesh(geometry, material);
          fuselage.rotation.z = Math.PI / 2;
          jetGroup.add(fuselage);
          
          // Wings
          const wingGeometry = new THREE.BoxGeometry(0.05, 1.5, 0.4);
          const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd0d0d0, 
            metalness: 0.7, 
            roughness: 0.3 
          });
          const wing = new THREE.Mesh(wingGeometry, wingMaterial);
          wing.position.set(0, 0, 0);
          jetGroup.add(wing);
          
          // Tail
          const tailGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.4);
          const tail = new THREE.Mesh(tailGeometry, wingMaterial);
          tail.position.set(-1, 0, 0);
          jetGroup.add(tail);
          
          // Vertical stabilizer
          const vStabGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
          const vStab = new THREE.Mesh(vStabGeometry, wingMaterial);
          vStab.position.set(-1, 0, 0);
          jetGroup.add(vStab);
          
          // Engines
          const engineGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 20);
          const engineMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            metalness: 0.9, 
            roughness: 0.3 
          });
          const engine1 = new THREE.Mesh(engineGeometry, engineMaterial);
          engine1.rotation.z = Math.PI / 2;
          engine1.position.set(0, -0.5, -0.2);
          jetGroup.add(engine1);
          
          const engine2 = new THREE.Mesh(engineGeometry, engineMaterial);
          engine2.rotation.z = Math.PI / 2;
          engine2.position.set(0, -0.5, 0.2);
          jetGroup.add(engine2);
          
          // Rotate the entire jet
          jetGroup.rotation.y = Math.PI / 4;
          
          vehicleMesh = jetGroup;
          break;
        
        case 'yacht':
          // Create yacht body
          const yachtGroup = new THREE.Group();
          
          // Hull
          const hullGeometry = new THREE.BoxGeometry(2, 0.5, 0.7);
          const hullMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 0.2, 
            roughness: 0.3 
          });
          const hull = new THREE.Mesh(hullGeometry, hullMaterial);
          hull.position.set(0, -0.1, 0);
          yachtGroup.add(hull);
          
          // Cabin
          const yachtCabinGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.5);
          const yachtCabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd0d0d0, 
            metalness: 0.5, 
            roughness: 0.2 
          });
          const yachtCabin = new THREE.Mesh(yachtCabinGeometry, yachtCabinMaterial);
          yachtCabin.position.set(-0.1, 0.35, 0);
          yachtGroup.add(yachtCabin);
          
          // Bridge
          const bridgeGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.45);
          const bridge = new THREE.Mesh(bridgeGeometry, yachtCabinMaterial);
          bridge.position.set(0.3, 0.5, 0);
          yachtGroup.add(bridge);
          
          // Deck
          const deckGeometry = new THREE.BoxGeometry(0.7, 0.05, 0.6);
          const deckMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x996633, 
            metalness: 0.1, 
            roughness: 0.8 
          });
          const deck = new THREE.Mesh(deckGeometry, deckMaterial);
          deck.position.set(-0.6, 0.2, 0);
          yachtGroup.add(deck);
          
          // Rotate the entire yacht
          yachtGroup.rotation.y = Math.PI / 4;
          
          vehicleMesh = yachtGroup;
          break;
        
        case 'helicopter':
          // Create helicopter body
          const helicopterGroup = new THREE.Group();
          
          // Main body
          geometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
          material = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            metalness: 0.7, 
            roughness: 0.3 
          });
          const body = new THREE.Mesh(geometry, material);
          body.rotation.z = Math.PI / 2;
          helicopterGroup.add(body);
          
          // Tail boom
          const tailBoomGeometry = new THREE.CylinderGeometry(0.08, 0.15, 1.5, 8);
          const tailBoom = new THREE.Mesh(tailBoomGeometry, material);
          tailBoom.rotation.z = Math.PI / 2;
          tailBoom.position.set(-1, 0, 0);
          helicopterGroup.add(tailBoom);
          
          // Main rotor
          const rotorGeometry = new THREE.BoxGeometry(0.05, 2, 0.1);
          const rotorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444, 
            metalness: 0.8, 
            roughness: 0.2 
          });
          const mainRotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
          mainRotor.position.set(0, 0.5, 0);
          helicopterGroup.add(mainRotor);
          
          // Tail rotor
          const tailRotorGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.05);
          const tailRotor = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
          tailRotor.position.set(-1.7, 0, 0.2);
          tailRotor.rotation.x = Math.PI / 2;
          helicopterGroup.add(tailRotor);
          
          // Landing skids
          const skidGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8);
          const skidMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888, 
            metalness: 0.9, 
            roughness: 0.1 
          });
          
          const skid1 = new THREE.Mesh(skidGeometry, skidMaterial);
          skid1.rotation.z = Math.PI / 2;
          skid1.position.set(0, -0.5, 0.25);
          helicopterGroup.add(skid1);
          
          const skid2 = new THREE.Mesh(skidGeometry, skidMaterial);
          skid2.rotation.z = Math.PI / 2;
          skid2.position.set(0, -0.5, -0.25);
          helicopterGroup.add(skid2);
          
          // Add animation for rotors
          gsap.to(mainRotor.rotation, {
            y: Math.PI * 2,
            duration: 0.5,
            repeat: -1,
            ease: "none"
          });
          
          gsap.to(tailRotor.rotation, {
            y: Math.PI * 2,
            duration: 0.3,
            repeat: -1,
            ease: "none"
          });
          
          // Rotate the entire helicopter
          helicopterGroup.rotation.y = Math.PI / 4;
          
          vehicleMesh = helicopterGroup;
          break;
        
        case 'car':
          // Create sports car body
          const carGroup = new THREE.Group();
          
          // Main body
          const carBodyGeometry = new THREE.BoxGeometry(2, 0.4, 0.9);
          const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            metalness: 0.9, 
            roughness: 0.2 
          });
          const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
          carGroup.add(carBody);
          
          // Cabin/windshield
          const carCabinGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);
          const carCabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.8, 
            roughness: 0.2,
            transparent: true,
            opacity: 0.7
          });
          const carCabin = new THREE.Mesh(carCabinGeometry, carCabinMaterial);
          carCabin.position.set(-0.2, 0.35, 0);
          carGroup.add(carCabin);
          
          // Wheels
          const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
          const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            metalness: 0.8, 
            roughness: 0.5 
          });
          
          // Front left wheel
          const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheelFL.rotation.z = Math.PI / 2;
          wheelFL.position.set(0.7, -0.2, -0.5);
          carGroup.add(wheelFL);
          
          // Front right wheel
          const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheelFR.rotation.z = Math.PI / 2;
          wheelFR.position.set(0.7, -0.2, 0.5);
          carGroup.add(wheelFR);
          
          // Rear left wheel
          const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheelRL.rotation.z = Math.PI / 2;
          wheelRL.position.set(-0.7, -0.2, -0.5);
          carGroup.add(wheelRL);
          
          // Rear right wheel
          const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheelRR.rotation.z = Math.PI / 2;
          wheelRR.position.set(-0.7, -0.2, 0.5);
          carGroup.add(wheelRR);
          
          // Rotate the entire car
          carGroup.rotation.y = Math.PI / 4;
          
          vehicleMesh = carGroup;
          break;
      }
      
      scene.add(vehicleMesh);
      return vehicleMesh;
    };
    
    const vehicleMeshInstance = createVehicleMesh();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement effect
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the container
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      gsap.to(vehicleMeshInstance.rotation, {
        y: Math.PI / 4 + mouse.x * 0.5,
        x: mouse.y * 0.2,
        duration: 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Subtle floating animation
      if (vehicleMeshInstance) {
        vehicleMeshInstance.position.y = Math.sin(elapsedTime) * 0.05;
      }
      
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
      scene.clear();
    };
  }, [vehicleType, isVisible, isMobile]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-64 md:h-80 ${className}`}
      style={{ position: 'relative' }}
    />
  );
}