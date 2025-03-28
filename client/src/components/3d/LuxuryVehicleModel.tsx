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
    
    // Scene setup with enhanced lighting for realistic reflections
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50, 
      (containerRef.current.clientWidth || 1) / (containerRef.current.clientHeight || 1), 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Enhanced camera positioning for better view
    camera.position.set(0, 0.5, 6);
    
    // Studio-like lighting setup for realistic reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Key light - main directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(3, 3, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    
    // Fill light - softer light from opposite side
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-3, 2, 0);
    scene.add(fillLight);
    
    // Rim light - creates highlight edge
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(1, 1, -3);
    scene.add(rimLight);
    
    // Accent colors for different vehicle types
    const accentColors = {
      'jet': 0x00a8ff,
      'yacht': 0x70afe8,
      'helicopter': 0x68e8b0,
      'car': 0xff3300
    };
    
    // Add accent light with color specific to vehicle type
    const accentLight = new THREE.PointLight(accentColors[vehicleType], 3, 10);
    accentLight.position.set(-1, 2, 2);
    scene.add(accentLight);
    
    // Create highly detailed shape of vehicle
    let vehicleMesh: THREE.Object3D;
    
    const createVehicleMesh = () => {
      // Remove any existing vehicle mesh
      if (vehicleMesh) scene.remove(vehicleMesh);
      
      // Create different detailed models based on vehicle type
      switch (vehicleType) {
        case 'jet':
          // Create luxury private jet (Gulfstream G650 inspired)
          const jetGroup = new THREE.Group();
          
          // Create advanced fuselage with better shape and details
          const fuselageShape = new THREE.Shape();
          // Draw front-to-back profile with proper aerodynamic shape
          fuselageShape.moveTo(2.5, 0);
          fuselageShape.quadraticCurveTo(2.2, 0.4, 1.5, 0.5); // Nose cone
          fuselageShape.lineTo(-1.8, 0.5); // Main body
          fuselageShape.quadraticCurveTo(-2.3, 0.4, -2.5, 0.1); // Tail section
          fuselageShape.lineTo(-2.5, -0.1);
          fuselageShape.quadraticCurveTo(-2.3, -0.4, -1.8, -0.5); // Bottom tail
          fuselageShape.lineTo(1.5, -0.5); // Bottom body
          fuselageShape.quadraticCurveTo(2.2, -0.4, 2.5, 0); // Complete the nose
          
          // Create 3D geometry by extruding the shape
          const extrudeSettings = {
            steps: 1,
            depth: 0.6,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 5
          };
          
          const fuselageGeometry = new THREE.ExtrudeGeometry(fuselageShape, extrudeSettings);
          
          // Rotate to correct orientation
          fuselageGeometry.rotateY(Math.PI / 2);
          
          // High-end metallic material with reflections
          const fuseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xfafafa, 
            metalness: 0.9, 
            roughness: 0.2,
            envMapIntensity: 1.0
          });
          
          const fuselage = new THREE.Mesh(fuselageGeometry, fuseMaterial);
          fuselage.castShadow = true;
          fuselage.receiveShadow = true;
          jetGroup.add(fuselage);
          
          // Wings with better aerodynamic shape
          const wingShape = new THREE.Shape();
          wingShape.moveTo(0, 0);
          wingShape.lineTo(1.8, -0.2); // Swept-back wing
          wingShape.lineTo(1.8, -0.3);
          wingShape.lineTo(0.2, -0.6); // Wing tip
          wingShape.lineTo(0, -0.5);
          wingShape.lineTo(0, 0);
          
          const wingExtrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
          };
          
          const wingGeometry = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
          
          const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0, 
            metalness: 0.8, 
            roughness: 0.3
          });
          
          // Left wing
          const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
          leftWing.position.set(0, 0, -0.3);
          leftWing.castShadow = true;
          leftWing.receiveShadow = true;
          jetGroup.add(leftWing);
          
          // Right wing (mirrored)
          const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
          rightWing.position.set(0, 0, 0.3);
          rightWing.scale.z = -1; // Mirror
          rightWing.castShadow = true;
          rightWing.receiveShadow = true;
          jetGroup.add(rightWing);
          
          // Vertical tail fin
          const jetTailFinShape = new THREE.Shape();
          jetTailFinShape.moveTo(0, 0);
          jetTailFinShape.lineTo(-0.8, 0.8); // Swept-back tail
          jetTailFinShape.lineTo(-1.0, 0.8);
          jetTailFinShape.lineTo(-0.4, 0);
          jetTailFinShape.lineTo(0, 0);
          
          const jetTailFinGeometry = new THREE.ExtrudeGeometry(jetTailFinShape, {
            steps: 1,
            depth: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2
          });
          
          const jetTailFin = new THREE.Mesh(jetTailFinGeometry, wingMaterial);
          jetTailFin.position.set(-1.7, 0.5, -0.025);
          jetTailFin.castShadow = true;
          jetTailFin.receiveShadow = true;
          jetGroup.add(jetTailFin);
          
          // Engines with highly detailed design
          const engineLength = 1.2;
          const engineRadius = 0.25;
          
          const engineGeometry = new THREE.CylinderGeometry(
            engineRadius, engineRadius * 1.1, engineLength, 24, 1, true
          );
          
          const engineMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            metalness: 0.9, 
            roughness: 0.3,
            side: THREE.DoubleSide
          });
          
          // Engine housing (with realistic inlet and exhaust)
          const engine1Housing = new THREE.Mesh(engineGeometry, engineMaterial);
          engine1Housing.rotation.z = Math.PI / 2;
          engine1Housing.position.set(0, -0.3, -1.2);
          engine1Housing.castShadow = true;
          engine1Housing.receiveShadow = true;
          jetGroup.add(engine1Housing);
          
          // Engine inlet (fan face)
          const engineInlet1 = new THREE.CircleGeometry(engineRadius * 0.9, 24);
          const engineInletMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            metalness: 0.7, 
            roughness: 0.7
          });
          const engineInletMesh1 = new THREE.Mesh(engineInlet1, engineInletMaterial);
          engineInletMesh1.position.set(engineLength/2 + 0.01, -0.3, -1.2);
          engineInletMesh1.rotation.y = Math.PI / 2;
          jetGroup.add(engineInletMesh1);
          
          // Second engine
          const engine2Housing = new THREE.Mesh(engineGeometry, engineMaterial);
          engine2Housing.rotation.z = Math.PI / 2;
          engine2Housing.position.set(0, -0.3, 1.2);
          engine2Housing.castShadow = true;
          engine2Housing.receiveShadow = true;
          jetGroup.add(engine2Housing);
          
          // Engine inlet (fan face)
          const engineInlet2 = new THREE.CircleGeometry(engineRadius * 0.9, 24);
          const engineInletMesh2 = new THREE.Mesh(engineInlet2, engineInletMaterial);
          engineInletMesh2.position.set(engineLength/2 + 0.01, -0.3, 1.2);
          engineInletMesh2.rotation.y = Math.PI / 2;
          jetGroup.add(engineInletMesh2);
          
          // Cockpit windshield
          const jetWindshieldGeometry = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
          const jetWindshieldMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.7
          });
          
          const jetWindshield = new THREE.Mesh(jetWindshieldGeometry, jetWindshieldMaterial);
          jetWindshield.scale.set(0.7, 0.4, 0.5);
          jetWindshield.rotation.x = Math.PI;
          jetWindshield.position.set(1.5, 0.6, 0);
          jetGroup.add(jetWindshield);
          
          // Livery details - add a luxury stripe down the side
          const jetStripeGeometry = new THREE.PlaneGeometry(4.5, 0.1);
          const jetStripeMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold color
            metalness: 1.0,
            roughness: 0.2,
            side: THREE.DoubleSide
          });
          
          // Left stripe
          const leftStripe = new THREE.Mesh(jetStripeGeometry, jetStripeMaterial);
          leftStripe.position.set(0, 0.25, -0.36);
          leftStripe.rotation.y = Math.PI / 2;
          jetGroup.add(leftStripe);
          
          // Right stripe
          const rightStripe = new THREE.Mesh(jetStripeGeometry, jetStripeMaterial);
          rightStripe.position.set(0, 0.25, 0.36);
          rightStripe.rotation.y = Math.PI / 2;
          jetGroup.add(rightStripe);
          
          // Rotate jet for best view angle
          jetGroup.rotation.y = Math.PI / 4;
          jetGroup.position.y = -0.5;
          
          vehicleMesh = jetGroup;
          break;
        
        case 'yacht':
          // Create luxury yacht (mega yacht inspired)
          const yachtGroup = new THREE.Group();
          
          // Create detailed hull with proper ship-like shape
          const hullShape = new THREE.Shape();
          hullShape.moveTo(2.5, 0);
          hullShape.quadraticCurveTo(2.6, 0.2, 2.4, 0.4); // Bow
          hullShape.lineTo(-2.4, 0.4); // Deck line
          hullShape.quadraticCurveTo(-2.6, 0.2, -2.5, 0); // Stern
          hullShape.quadraticCurveTo(-2.4, -0.5, -2.0, -0.6); // Keel at stern
          hullShape.lineTo(2.0, -0.6); // Keel line
          hullShape.quadraticCurveTo(2.4, -0.5, 2.5, 0); // Keel at bow
          
          const hullExtrudeSettings = {
            steps: 1,
            depth: 0.8,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
          };
          
          const hullGeometry = new THREE.ExtrudeGeometry(hullShape, hullExtrudeSettings);
          
          const hullMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 0.2, 
            roughness: 0.3 
          });
          
          const hull = new THREE.Mesh(hullGeometry, hullMaterial);
          hull.castShadow = true;
          hull.receiveShadow = true;
          yachtGroup.add(hull);
          
          // Main deck
          const mainDeckGeometry = new THREE.BoxGeometry(4.0, 0.05, 0.75);
          const deckMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xa0522d, // Brown teak deck
            metalness: 0.1, 
            roughness: 0.8 
          });
          
          const mainDeck = new THREE.Mesh(mainDeckGeometry, deckMaterial);
          mainDeck.position.set(0, 0.45, 0);
          mainDeck.castShadow = true;
          mainDeck.receiveShadow = true;
          yachtGroup.add(mainDeck);
          
          // Forward cabin
          const forwardCabinGeometry = new THREE.BoxGeometry(1.0, 0.3, 0.7);
          const cabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 0.4, 
            roughness: 0.4 
          });
          
          const forwardCabin = new THREE.Mesh(forwardCabinGeometry, cabinMaterial);
          forwardCabin.position.set(1.0, 0.6, 0);
          forwardCabin.castShadow = true;
          forwardCabin.receiveShadow = true;
          yachtGroup.add(forwardCabin);
          
          // Main cabin/superstructure
          const mainCabinGeometry = new THREE.BoxGeometry(2.0, 0.5, 0.65);
          
          const mainCabin = new THREE.Mesh(mainCabinGeometry, cabinMaterial);
          mainCabin.position.set(-0.3, 0.7, 0);
          mainCabin.castShadow = true;
          mainCabin.receiveShadow = true;
          yachtGroup.add(mainCabin);
          
          // Bridge/wheelhouse
          const bridgeGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
          
          const bridge = new THREE.Mesh(bridgeGeometry, cabinMaterial);
          bridge.position.set(-1.0, 1.2, 0);
          bridge.castShadow = true;
          bridge.receiveShadow = true;
          yachtGroup.add(bridge);
          
          // Windows with realistic glass material
          const windowMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.7
          });
          
          // Add windows to cabins
          const addWindows = (parent: THREE.Object3D, width: number, height: number, z: number, countX: number, y: number) => {
            const windowWidth = width / (countX + 1);
            const windowHeight = height * 0.5;
            const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
            
            const startX = -width/2 + windowWidth;
            const spacing = (width - windowWidth*2) / (countX - 1);
            
            for (let i = 0; i < countX; i++) {
              // Left side
              const windowLeft = new THREE.Mesh(windowGeometry, windowMaterial);
              windowLeft.position.set(startX + spacing * i, y, z/2 + 0.01);
              windowLeft.rotation.y = Math.PI;
              parent.add(windowLeft);
              
              // Right side
              const windowRight = new THREE.Mesh(windowGeometry, windowMaterial);
              windowRight.position.set(startX + spacing * i, y, -z/2 - 0.01);
              parent.add(windowRight);
            }
          };
          
          // Add windows to various parts of the yacht
          addWindows(forwardCabin, 1.0, 0.3, 0.7, 2, 0.6);
          addWindows(mainCabin, 2.0, 0.5, 0.65, 5, 0.7);
          addWindows(bridge, 0.6, 0.4, 0.6, 2, 1.2);
          
          // Luxury details
          // Radar/communication equipment
          const radarBaseGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
          const radarBase = new THREE.Mesh(radarBaseGeometry, new THREE.MeshStandardMaterial({ color: 0x888888 }));
          radarBase.position.set(-1.0, 1.5, 0);
          yachtGroup.add(radarBase);
          
          const radarDishGeometry = new THREE.CircleGeometry(0.15, 8);
          const radarDish = new THREE.Mesh(radarDishGeometry, new THREE.MeshStandardMaterial({ color: 0xdddddd }));
          radarDish.position.set(-1.0, 1.6, 0);
          radarDish.rotation.x = -Math.PI / 2;
          radarDish.rotation.z = Math.PI / 4;
          yachtGroup.add(radarDish);
          
          // Railings
          const createRailing = (length: number, x: number, y: number, z: number) => {
            const railingGroup = new THREE.Group();
            const railMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });
            
            // Top rail
            const topRail = new THREE.Mesh(
              new THREE.CylinderGeometry(0.01, 0.01, length, 8),
              railMaterial
            );
            topRail.rotation.z = Math.PI / 2;
            topRail.position.y = 0.1;
            railingGroup.add(topRail);
            
            // Posts
            const postCount = Math.floor(length / 0.2);
            for (let i = 0; i <= postCount; i++) {
              const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.005, 0.005, 0.1, 4),
                railMaterial
              );
              post.position.x = (i * length / postCount) - length/2;
              railingGroup.add(post);
            }
            
            railingGroup.position.set(x, y, z);
            return railingGroup;
          };
          
          // Add railings around decks
          yachtGroup.add(createRailing(4.0, 0, 0.5, 0.4));
          yachtGroup.add(createRailing(4.0, 0, 0.5, -0.4));
          yachtGroup.add(createRailing(0.8, 2.0, 0.5, 0));
          yachtGroup.add(createRailing(0.8, -2.0, 0.5, 0));
          
          // Swimming platform at the back
          const platformGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.6);
          const platform = new THREE.Mesh(platformGeometry, deckMaterial);
          platform.position.set(-2.3, 0.2, 0);
          yachtGroup.add(platform);
          
          // Luxury tender/dingy at the back
          const dingyGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.3);
          const dingyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
          const dingy = new THREE.Mesh(dingyGeometry, dingyMaterial);
          dingy.position.set(-1.8, 0.5, 0);
          yachtGroup.add(dingy);
          
          // Set position and rotation
          yachtGroup.rotation.y = Math.PI / 4;
          yachtGroup.position.y = -0.8;
          yachtGroup.scale.set(0.7, 0.7, 0.7);
          
          vehicleMesh = yachtGroup;
          break;
        
        case 'helicopter':
          // Create luxury helicopter (inspired by high-end models like Bell 429)
          const helicopterGroup = new THREE.Group();
          
          // Main body - more complex shape for realistic fuselage
          const bodyGeometry = new THREE.CapsuleGeometry(0.4, 2.0, 8, 16);
          const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.7, 
            roughness: 0.3 
          });
          
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
          body.rotation.z = Math.PI / 2;
          body.scale.set(1, 0.7, 0.7);
          body.castShadow = true;
          body.receiveShadow = true;
          helicopterGroup.add(body);
          
          // Cockpit windshield - transparent curved glass
          const cockpitShape = new THREE.Shape();
          cockpitShape.moveTo(0, 0);
          cockpitShape.quadraticCurveTo(0.3, 0.4, 0.8, 0.4);
          cockpitShape.lineTo(0.8, -0.4);
          cockpitShape.quadraticCurveTo(0.3, -0.4, 0, 0);
          
          const cockpitGeometry = new THREE.ExtrudeGeometry(cockpitShape, {
            steps: 1,
            depth: 0.8,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
          });
          
          const cockpitMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.7
          });
          
          const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
          cockpit.position.set(1.0, 0, -0.4);
          cockpit.rotation.y = Math.PI / 2;
          cockpit.castShadow = true;
          helicopterGroup.add(cockpit);
          
          // Tail boom
          const tailBoomGeometry = new THREE.CylinderGeometry(0.15, 0.08, 2.0, 8);
          const tailBoom = new THREE.Mesh(tailBoomGeometry, bodyMaterial);
          tailBoom.rotation.z = Math.PI / 2;
          tailBoom.position.set(-1.2, 0.1, 0);
          tailBoom.castShadow = true;
          tailBoom.receiveShadow = true;
          helicopterGroup.add(tailBoom);
          
          // Tail fin
          const heliTailFinShape = new THREE.Shape();
          heliTailFinShape.moveTo(0, 0);
          heliTailFinShape.lineTo(0.6, 0.8);
          heliTailFinShape.lineTo(0.3, 0.8);
          heliTailFinShape.lineTo(-0.2, 0);
          heliTailFinShape.lineTo(0, 0);
          
          const heliTailFinGeometry = new THREE.ExtrudeGeometry(heliTailFinShape, {
            steps: 1,
            depth: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2
          });
          
          const heliTailFin = new THREE.Mesh(heliTailFinGeometry, bodyMaterial);
          heliTailFin.position.set(-2.2, 0.2, -0.025);
          heliTailFin.castShadow = true;
          heliTailFin.receiveShadow = true;
          helicopterGroup.add(heliTailFin);
          
          // Main rotor hub
          const rotorHubGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);
          const rotorHubMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            metalness: 0.9, 
            roughness: 0.2 
          });
          
          const rotorHub = new THREE.Mesh(rotorHubGeometry, rotorHubMaterial);
          rotorHub.position.set(0, 0.6, 0);
          helicopterGroup.add(rotorHub);
          
          // Main rotor blades (4 blades for luxury model)
          const rotorGroup = new THREE.Group();
          const rotorBladeGeometry = new THREE.BoxGeometry(2.2, 0.02, 0.2);
          rotorBladeGeometry.translate(1.1, 0, 0); // Move pivot to one end
          
          const rotorBladeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            metalness: 0.7, 
            roughness: 0.3 
          });
          
          for (let i = 0; i < 4; i++) {
            const rotorBlade = new THREE.Mesh(rotorBladeGeometry, rotorBladeMaterial);
            rotorBlade.rotation.y = (Math.PI / 2) * i;
            rotorBlade.castShadow = true;
            rotorGroup.add(rotorBlade);
          }
          
          rotorGroup.position.set(0, 0.65, 0);
          helicopterGroup.add(rotorGroup);
          
          // Tail rotor
          const tailRotorGroup = new THREE.Group();
          const tailRotorBladeGeometry = new THREE.BoxGeometry(0.7, 0.02, 0.1);
          tailRotorBladeGeometry.translate(0.35, 0, 0); // Move pivot to one end
          
          for (let i = 0; i < 2; i++) {
            const tailRotorBlade = new THREE.Mesh(tailRotorBladeGeometry, rotorBladeMaterial);
            tailRotorBlade.rotation.x = Math.PI * i;
            tailRotorBlade.castShadow = true;
            tailRotorGroup.add(tailRotorBlade);
          }
          
          tailRotorGroup.position.set(-2.3, 0.5, 0.2);
          tailRotorGroup.rotation.y = Math.PI / 2;
          helicopterGroup.add(tailRotorGroup);
          
          // Landing skids with suspension details
          const skidBarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8);
          const skidBarMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888, 
            metalness: 0.9, 
            roughness: 0.1 
          });
          
          // Front skid bar
          const frontSkidBar = new THREE.Mesh(skidBarGeometry, skidBarMaterial);
          frontSkidBar.rotation.z = Math.PI / 2;
          frontSkidBar.position.set(0.5, -0.6, 0);
          frontSkidBar.castShadow = true;
          helicopterGroup.add(frontSkidBar);
          
          // Rear skid bar
          const rearSkidBar = new THREE.Mesh(skidBarGeometry, skidBarMaterial);
          rearSkidBar.rotation.z = Math.PI / 2;
          rearSkidBar.position.set(-0.5, -0.6, 0);
          rearSkidBar.castShadow = true;
          helicopterGroup.add(rearSkidBar);
          
          // Suspension struts connecting skids to body
          const createStrut = (x: number, z: number) => {
            const strutGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
            const strut = new THREE.Mesh(strutGeometry, skidBarMaterial);
            strut.position.set(x, -0.35, z);
            strut.castShadow = true;
            return strut;
          };
          
          helicopterGroup.add(createStrut(0.5, 0.7));
          helicopterGroup.add(createStrut(0.5, -0.7));
          helicopterGroup.add(createStrut(-0.5, 0.7));
          helicopterGroup.add(createStrut(-0.5, -0.7));
          
          // Add luxury details - company logo/stripe
          const heliStripeGeometry = new THREE.PlaneGeometry(2, 0.2);
          const heliStripeMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold color for luxury brand
            metalness: 1.0,
            roughness: 0.2,
            side: THREE.DoubleSide
          });
          
          const heliStripe = new THREE.Mesh(heliStripeGeometry, heliStripeMaterial);
          heliStripe.position.set(0.2, 0, -0.41);
          heliStripe.rotation.y = Math.PI / 2;
          helicopterGroup.add(heliStripe);
          
          // Add animation for rotors
          gsap.to(rotorGroup.rotation, {
            y: Math.PI * 2,
            duration: 0.2,
            repeat: -1,
            ease: "none"
          });
          
          gsap.to(tailRotorGroup.rotation, {
            x: Math.PI * 2,
            duration: 0.1,
            repeat: -1,
            ease: "none"
          });
          
          // Set position and rotation
          helicopterGroup.rotation.y = Math.PI / 4;
          helicopterGroup.position.y = -0.4;
          
          vehicleMesh = helicopterGroup;
          break;
        
        case 'car':
          // Create luxury supercar (inspired by Lamborghini design)
          const carGroup = new THREE.Group();
          
          // Main body shell with aerodynamic wedge shape
          const carBodyShape = new THREE.Shape();
          // Draw the side profile of the car
          carBodyShape.moveTo(2.0, 0);
          carBodyShape.lineTo(1.8, 0.1); // Front bumper
          carBodyShape.lineTo(1.4, 0.2); // Hood
          carBodyShape.lineTo(0.8, 0.5); // Windshield
          carBodyShape.lineTo(-0.5, 0.5); // Roof
          carBodyShape.lineTo(-1.2, 0.3); // Rear window
          carBodyShape.lineTo(-1.8, 0.2); // Rear deck
          carBodyShape.lineTo(-2.0, 0.1); // Rear bumper
          carBodyShape.lineTo(-2.0, -0.2); // Bottom rear
          carBodyShape.lineTo(2.0, -0.2); // Bottom front
          carBodyShape.lineTo(2.0, 0); // Close shape
          
          const carBodyExtrudeSettings = {
            steps: 1,
            depth: 0.9,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
          };
          
          const carBodyGeometry = new THREE.ExtrudeGeometry(carBodyShape, carBodyExtrudeSettings);
          
          // High-gloss metallic paint with realistic finish
          const carBodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, // Signature red
            metalness: 0.9, 
            roughness: 0.2,
            envMapIntensity: 1.0
          });
          
          const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
          carBody.rotation.y = Math.PI / 2;
          carBody.position.z = -0.45;
          carBody.castShadow = true;
          carBody.receiveShadow = true;
          carGroup.add(carBody);
          
          // Windshield and windows with realistic glass
          const carWindshieldGeometry = new THREE.PlaneGeometry(0.8, 0.4);
          const carGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.7
          });
          
          // Front windshield
          const carWindshield = new THREE.Mesh(carWindshieldGeometry, carGlassMaterial);
          carWindshield.position.set(1.0, 0.35, 0);
          carWindshield.rotation.set(-Math.PI/4, 0, 0);
          carGroup.add(carWindshield);
          
          // Side windows
          const sideWindowGeometry = new THREE.PlaneGeometry(1.0, 0.25);
          
          // Left window
          const leftWindow = new THREE.Mesh(sideWindowGeometry, carGlassMaterial);
          leftWindow.position.set(0.2, 0.35, 0.48);
          leftWindow.rotation.y = Math.PI/2;
          carGroup.add(leftWindow);
          
          // Right window
          const rightWindow = new THREE.Mesh(sideWindowGeometry, carGlassMaterial);
          rightWindow.position.set(0.2, 0.35, -0.48);
          rightWindow.rotation.y = -Math.PI/2;
          carGroup.add(rightWindow);
          
          // Rear window
          const rearWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), carGlassMaterial);
          rearWindow.position.set(-0.9, 0.4, 0);
          rearWindow.rotation.set(Math.PI/6, Math.PI, 0);
          carGroup.add(rearWindow);
          
          // Wheels with detailed rims and low-profile tires
          const createWheel = (x: number, z: number) => {
            const wheelGroup = new THREE.Group();
            
            // Tire
            const tireGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.12, 24);
            const tireMaterial = new THREE.MeshStandardMaterial({ 
              color: 0x111111, 
              metalness: 0.1, 
              roughness: 0.9 
            });
            
            const tire = new THREE.Mesh(tireGeometry, tireMaterial);
            tire.rotation.z = Math.PI/2;
            tire.castShadow = true;
            wheelGroup.add(tire);
            
            // Rim
            const rimGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.13, 10);
            const rimMaterial = new THREE.MeshStandardMaterial({ 
              color: 0xdddddd, 
              metalness: 0.9, 
              roughness: 0.1 
            });
            
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI/2;
            rim.castShadow = true;
            wheelGroup.add(rim);
            
            // Spokes
            const spokeGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.35);
            
            for (let i = 0; i < 5; i++) {
              const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
              spoke.rotation.y = (Math.PI/2.5) * i;
              spoke.position.z = 0;
              spoke.castShadow = true;
              rim.add(spoke);
            }
            
            // Center cap
            const capGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.14, 12);
            const capMaterial = new THREE.MeshStandardMaterial({ 
              color: 0x222222, 
              metalness: 0.9, 
              roughness: 0.2 
            });
            
            const cap = new THREE.Mesh(capGeometry, capMaterial);
            cap.rotation.z = Math.PI/2;
            wheelGroup.add(cap);
            
            // Position the wheel
            wheelGroup.position.set(x, -0.2, z);
            return wheelGroup;
          };
          
          // Add wheels
          carGroup.add(createWheel(1.2, -0.5));
          carGroup.add(createWheel(1.2, 0.5));
          carGroup.add(createWheel(-1.0, -0.5));
          carGroup.add(createWheel(-1.0, 0.5));
          
          // Add details: headlights
          const headlightGeometry = new THREE.CapsuleGeometry(0.08, 0.1, 4, 8);
          const headlightMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffee,
            emissive: 0xffffee,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1.0
          });
          
          // Left headlight
          const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
          leftHeadlight.rotation.z = Math.PI/2;
          leftHeadlight.position.set(1.9, 0.1, -0.3);
          carGroup.add(leftHeadlight);
          
          // Right headlight
          const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
          rightHeadlight.rotation.z = Math.PI/2;
          rightHeadlight.position.set(1.9, 0.1, 0.3);
          carGroup.add(rightHeadlight);
          
          // Exhaust pipes
          const exhaustGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8);
          const exhaustMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            metalness: 0.9,
            roughness: 0.1
          });
          
          // Left exhaust
          const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
          leftExhaust.rotation.z = Math.PI/2;
          leftExhaust.position.set(-2.0, -0.1, -0.2);
          carGroup.add(leftExhaust);
          
          // Right exhaust
          const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
          rightExhaust.rotation.z = Math.PI/2;
          rightExhaust.position.set(-2.0, -0.1, 0.2);
          carGroup.add(rightExhaust);
          
          // Rear spoiler
          const spoilerWingGeometry = new THREE.BoxGeometry(0.05, 0.1, 0.8);
          const spoilerMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.7,
            roughness: 0.3
          });
          
          const spoilerWing = new THREE.Mesh(spoilerWingGeometry, spoilerMaterial);
          spoilerWing.position.set(-1.7, 0.3, 0);
          carGroup.add(spoilerWing);
          
          // Spoiler supports
          const spoilerSupportGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.03);
          
          const leftSupport = new THREE.Mesh(spoilerSupportGeometry, spoilerMaterial);
          leftSupport.position.set(-1.7, 0.2, -0.3);
          carGroup.add(leftSupport);
          
          const rightSupport = new THREE.Mesh(spoilerSupportGeometry, spoilerMaterial);
          rightSupport.position.set(-1.7, 0.2, 0.3);
          carGroup.add(rightSupport);
          
          // Side air intakes
          const intakeGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.05);
          const intakeMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2
          });
          
          // Left intake
          const leftIntake = new THREE.Mesh(intakeGeometry, intakeMaterial);
          leftIntake.position.set(0.2, 0, -0.48);
          leftIntake.rotation.y = Math.PI/2;
          carGroup.add(leftIntake);
          
          // Right intake
          const rightIntake = new THREE.Mesh(intakeGeometry, intakeMaterial);
          rightIntake.position.set(0.2, 0, 0.48);
          rightIntake.rotation.y = Math.PI/2;
          carGroup.add(rightIntake);
          
          // Set position and rotation
          carGroup.rotation.y = Math.PI / 4;
          carGroup.position.y = -0.3;
          carGroup.scale.set(0.7, 0.7, 0.7);
          
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
    
    // Enhanced mouse movement effect for interactive viewing
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the container
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Smoother rotation with easing for a more premium feel
      gsap.to(vehicleMeshInstance.rotation, {
        y: Math.PI / 4 + mouse.x * 0.7,
        x: mouse.y * 0.3,
        duration: 1.2,
        ease: "power2.out"
      });
      
      // Subtle movement to follow mouse - gives parallax effect
      gsap.to(vehicleMeshInstance.position, {
        x: mouse.x * 0.3,
        duration: 1.5,
        ease: "power2.out"
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop with enhanced floating effect
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // More sophisticated floating animation
      if (vehicleMeshInstance) {
        vehicleMeshInstance.position.y += Math.sin(elapsedTime * 1.5) * 0.0008;
        
        // Slight rotation for a more "alive" feel
        if (vehicleType === 'yacht') {
          // Simulate gentle rocking on water
          vehicleMeshInstance.rotation.z = Math.sin(elapsedTime * 0.8) * 0.03;
        } else if (vehicleType === 'helicopter' || vehicleType === 'jet') {
          // Subtle hovering effect
          vehicleMeshInstance.rotation.z = Math.sin(elapsedTime * 1.2) * 0.01;
        }
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
      className={`relative w-full h-64 md:h-96 ${className}`}
      style={{ position: 'relative' }}
    />
  );
}