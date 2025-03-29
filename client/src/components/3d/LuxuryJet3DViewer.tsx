import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface LuxuryJet3DViewerProps {
  className?: string;
  onLoad?: () => void;
}

export function LuxuryJet3DViewer({ className = '', onLoad }: LuxuryJet3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene with light background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282c34);
    
    // Enhanced lighting setup for better visibility
    
    // Add stronger ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Add main key light (like sun)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 5, 2);
    mainLight.castShadow = true;
    // Improve shadow quality
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    scene.add(mainLight);
    
    // Add warm fill light from opposite side (golden hour effect)
    const fillLight = new THREE.DirectionalLight(0xffcc88, 0.8);
    fillLight.position.set(-3, 2, -3);
    scene.add(fillLight);
    
    // Add blue-tinted rim light from below (like sky reflection)
    const rimLight = new THREE.DirectionalLight(0x8888ff, 0.5);
    rimLight.position.set(0, -3, 0);
    scene.add(rimLight);
    
    // Add point light near cockpit for highlights
    const cockpitLight = new THREE.PointLight(0xaaddff, 0.8, 10);
    cockpitLight.position.set(2, 0.5, 0);
    scene.add(cockpitLight);
    
    // Add point light at engines for engine glow effect
    const engineLight1 = new THREE.PointLight(0xff5500, 0.5, 3);
    engineLight1.position.set(-1.2, -0.1, -1.2);
    scene.add(engineLight1);
    
    const engineLight2 = new THREE.PointLight(0xff5500, 0.5, 3);
    engineLight2.position.set(-1.2, -0.1, 1.2);
    scene.add(engineLight2);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 2, 5);
    
    // Create renderer with better error handling
    let renderer: THREE.WebGLRenderer;
    
    try {
      // Create a more basic renderer with better compatibility
      renderer = new THREE.WebGLRenderer({ 
        antialias: false,  // Disable antialiasing for better performance
        alpha: true,
        powerPreference: 'default',
        preserveDrawingBuffer: false
      });
      
      // Set renderer properties
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
      
      // @ts-ignore - Three.js typings mismatch
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0; // Slightly reduce exposure to prevent overbrightness
      renderer.shadowMap.enabled = true;
      
      // Handle WebGL context loss
      renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.log('WebGL context lost. Trying to restore...');
        
        // Show an error toast
        toast({
          title: "3D View Issue",
          description: "Display problem detected. Trying to recover...",
          variant: "destructive"
        });
        
        // Force fallback to happen
        setLoading(false);
        if (onLoad) onLoad();
      });
      
      containerRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Error creating WebGL renderer:', error);
      
      // Create a simpler renderer as fallback
      renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        alpha: true,
        powerPreference: 'low-power'
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      
      toast({
        title: "Simplified 3D View",
        description: "Using simplified graphics mode for better compatibility.",
        variant: "default"
      });
      
      containerRef.current.appendChild(renderer.domElement);
    }
    
    // Add orbit controls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Create a sleek, high-fidelity luxury jet model
    try {
      // Create group to hold all jet parts
      const jetGroup = new THREE.Group();
      
      // Create a more detailed fuselage (main body) with tapering
      const fuselagePoints = [];
      // Create curved profile for fuselage
      const length = 6;
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        // Create tapering effect toward the tail
        const radius = 0.4 * (1 - 0.3 * Math.pow(t, 1.5));
        fuselagePoints.push(new THREE.Vector3(length * (0.5 - t), 0, 0));
      }
      
      // Create lathe geometry for fuselage
      const fuselageShape = new THREE.Shape();
      fuselageShape.moveTo(0, -0.4);
      fuselageShape.quadraticCurveTo(0.2, -0.5, 0.4, -0.38);
      fuselageShape.quadraticCurveTo(0.45, -0.2, 0.45, 0);
      fuselageShape.quadraticCurveTo(0.45, 0.2, 0.4, 0.38);
      fuselageShape.quadraticCurveTo(0.2, 0.5, 0, 0.4);
      fuselageShape.quadraticCurveTo(-0.2, 0.5, -0.4, 0.38);
      fuselageShape.quadraticCurveTo(-0.45, 0.2, -0.45, 0);
      fuselageShape.quadraticCurveTo(-0.45, -0.2, -0.4, -0.38);
      fuselageShape.quadraticCurveTo(-0.2, -0.5, 0, -0.4);
      
      const fuselageGeometry = new THREE.LatheGeometry(
        fuselageShape.getPoints(20), 
        24
      );
      
      const fuselageMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xfafafa,
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      });
      
      const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
      fuselage.rotation.z = Math.PI / 2;
      fuselage.scale.set(1, 0.8, 0.8);
      jetGroup.add(fuselage);
      
      // Create a more streamlined nose cone
      const noseShape = new THREE.Shape();
      noseShape.moveTo(0, 0);
      noseShape.quadraticCurveTo(0.2, 0.2, 0.35, 0);
      noseShape.quadraticCurveTo(0.2, -0.2, 0, 0);
      
      const noseGeometry = new THREE.LatheGeometry(
        noseShape.getPoints(12),
        24
      );
      
      const noseMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xfafafa,
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      });
      
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.set(3, 0, 0);
      nose.rotation.z = Math.PI / 2;
      nose.scale.set(1.5, 0.8, 0.8);
      jetGroup.add(nose);
      
      // Create a curved windshield/cockpit
      const cockpitShape = new THREE.Shape();
      cockpitShape.moveTo(0, -0.35);
      cockpitShape.quadraticCurveTo(0.2, -0.4, 0.4, -0.3);
      cockpitShape.lineTo(0.5, 0.3);
      cockpitShape.quadraticCurveTo(0.2, 0.4, 0, 0.35);
      cockpitShape.quadraticCurveTo(-0.2, 0.4, -0.5, 0.3);
      cockpitShape.lineTo(-0.4, -0.3);
      cockpitShape.quadraticCurveTo(-0.2, -0.4, 0, -0.35);
      
      const cockpitGeometry = new THREE.ExtrudeGeometry(cockpitShape, {
        steps: 1,
        depth: 0.6,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
      });
      
      const cockpitMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.7,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      
      const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
      cockpit.position.set(2.2, 0.2, -0.3);
      cockpit.rotation.y = Math.PI / 2;
      jetGroup.add(cockpit);
      
      // Create swept-back wings with more refined geometry
      const wingsShape = new THREE.Shape();
      wingsShape.moveTo(0, 0);
      wingsShape.lineTo(1.5, -2);
      wingsShape.lineTo(2.0, -2.2);
      wingsShape.quadraticCurveTo(2.2, -2.2, 2.2, -2);
      wingsShape.lineTo(1.8, 0);
      wingsShape.lineTo(0, 0);
      
      const wingsExtrudeSettings = {
        steps: 1,
        depth: 0.12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 3
      };
      
      const wingsGeometry = new THREE.ExtrudeGeometry(wingsShape, wingsExtrudeSettings);
      const wingsMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xf4f4f4,
        metalness: 0.4,
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3
      });
      
      const leftWing = new THREE.Mesh(wingsGeometry, wingsMaterial);
      leftWing.position.set(0.3, -0.3, 0);
      leftWing.rotation.z = Math.PI;
      leftWing.rotation.x = -Math.PI / 2;
      jetGroup.add(leftWing);
      
      const rightWing = leftWing.clone();
      rightWing.rotation.y = Math.PI;
      jetGroup.add(rightWing);
      
      // Create tail fin with better shape
      const tailFinShape = new THREE.Shape();
      tailFinShape.moveTo(0, 0);
      tailFinShape.lineTo(-0.3, 0);
      tailFinShape.lineTo(-0.8, 1.2);
      tailFinShape.quadraticCurveTo(-0.75, 1.3, -0.6, 1.25);
      tailFinShape.lineTo(0, 0.2);
      tailFinShape.lineTo(0, 0);
      
      const tailFinExtrudeSettings = {
        steps: 1,
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 2
      };
      
      const tailFinGeometry = new THREE.ExtrudeGeometry(tailFinShape, tailFinExtrudeSettings);
      const tailFinMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xf0f0f0,
        metalness: 0.4,
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3
      });
      
      const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
      tailFin.position.set(-2.8, 0, 0);
      tailFin.rotation.x = -Math.PI / 2;
      tailFin.rotation.z = Math.PI / 2;
      jetGroup.add(tailFin);
      
      // Create horizontal stabilizers
      const stabilizerShape = new THREE.Shape();
      stabilizerShape.moveTo(0, 0);
      stabilizerShape.lineTo(0.7, -0.5);
      stabilizerShape.lineTo(0.9, -0.5);
      stabilizerShape.quadraticCurveTo(0.95, -0.45, 0.9, -0.4);
      stabilizerShape.lineTo(0, 0);
      
      const stabilizerExtrudeSettings = {
        steps: 1,
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 2
      };
      
      const stabilizerGeometry = new THREE.ExtrudeGeometry(stabilizerShape, stabilizerExtrudeSettings);
      const stabilizerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf0f0f0,
        metalness: 0.4,
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3
      });
      
      const leftStabilizer = new THREE.Mesh(stabilizerGeometry, stabilizerMaterial);
      leftStabilizer.position.set(-2.8, 0.3, 0);
      leftStabilizer.rotation.z = Math.PI;
      leftStabilizer.rotation.x = -Math.PI / 2;
      jetGroup.add(leftStabilizer);
      
      const rightStabilizer = leftStabilizer.clone();
      rightStabilizer.rotation.y = Math.PI;
      jetGroup.add(rightStabilizer);
      
      // Create engine nacelles with more detailed geometry
      const engineShape = new THREE.Shape();
      engineShape.moveTo(0, 0);
      engineShape.bezierCurveTo(0.05, 0.15, 0.25, 0.25, 0.4, 0);
      engineShape.bezierCurveTo(0.25, -0.25, 0.05, -0.15, 0, 0);
      
      const engineGeometry = new THREE.LatheGeometry(
        engineShape.getPoints(12),
        20
      );
      
      const engineMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2
      });
      
      // Left engine
      const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
      leftEngine.position.set(-0.5, -0.1, -1.5);
      leftEngine.rotation.x = Math.PI / 2;
      leftEngine.scale.set(1, 1.6, 1);
      jetGroup.add(leftEngine);
      
      // Engine intake (left)
      const intakeGeometry = new THREE.RingGeometry(0.1, 0.35, 20);
      const intakeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
      
      const leftIntake = new THREE.Mesh(intakeGeometry, intakeMaterial);
      leftIntake.position.set(0.2, -0.1, -1.5);
      leftIntake.rotation.y = Math.PI / 2;
      jetGroup.add(leftIntake);
      
      // Engine exhaust (left) with glow effect
      const exhaustGeometry = new THREE.RingGeometry(0.05, 0.33, 20);
      const exhaustMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xff2200,
        emissiveIntensity: 0.7,
        side: THREE.DoubleSide,
        metalness: 0.8,
        roughness: 0.3
      });
      
      const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
      leftExhaust.position.set(-1.2, -0.1, -1.5);
      leftExhaust.rotation.y = Math.PI / 2;
      jetGroup.add(leftExhaust);
      
      // Engine glow effect
      const glowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      
      const leftGlow = new THREE.Mesh(glowGeometry, glowMaterial);
      leftGlow.position.set(-1.3, -0.1, -1.5);
      leftGlow.scale.set(1, 1, 2);
      jetGroup.add(leftGlow);
      
      // Right engine (clone left)
      const rightEngine = leftEngine.clone();
      rightEngine.position.set(-0.5, -0.1, 1.5);
      jetGroup.add(rightEngine);
      
      // Engine intake (right)
      const rightIntake = leftIntake.clone();
      rightIntake.position.set(0.2, -0.1, 1.5);
      jetGroup.add(rightIntake);
      
      // Engine exhaust (right)
      const rightExhaust = leftExhaust.clone();
      rightExhaust.position.set(-1.2, -0.1, 1.5);
      jetGroup.add(rightExhaust);
      
      // Engine glow (right)
      const rightGlow = leftGlow.clone();
      rightGlow.position.set(-1.3, -0.1, 1.5);
      jetGroup.add(rightGlow);
      
      // Add luxurious details - gold trim accent line along fuselage
      const accentShape = new THREE.Shape();
      accentShape.moveTo(0, 0);
      accentShape.lineTo(5.5, 0);
      accentShape.lineTo(5.5, 0.05);
      accentShape.lineTo(0, 0.05);
      accentShape.lineTo(0, 0);
      
      const accentGeometry = new THREE.ShapeGeometry(accentShape);
      const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 1.0,
        roughness: 0.3,
        emissive: 0xD4AF37,
        emissiveIntensity: 0.2
      });
      
      const accent = new THREE.Mesh(accentGeometry, accentMaterial);
      accent.position.set(-2.8, 0.1, 0.395);
      accent.rotation.y = Math.PI / 2;
      jetGroup.add(accent);
      
      // Add model to scene
      scene.add(jetGroup);
      
      // Complete loading
      setLoading(false);
      setLoadingProgress(100);
      
      // Call the onLoad callback if provided
      if (onLoad) onLoad();
      
      // Set an initial cool camera angle
      camera.position.set(3, 2, 3);
      controls.update();
    } catch (error) {
      console.error('Error creating 3D model:', error);
      toast({
        title: "3D Model Error",
        description: "Could not create the 3D model. Using fallback display.",
        variant: "destructive"
      });
      setLoading(false);
      
      // Call onLoad anyway so the fallback appears
      if (onLoad) onLoad();
    }
    
    // Handle zoom animations
    let zoomInterval: NodeJS.Timeout | null = null;
    let zoomingIn = true;
    
    // Start the automatic zoom effect
    const startZoomEffect = () => {
      if (zoomInterval) clearInterval(zoomInterval);
      
      zoomInterval = setInterval(() => {
        if (zoomingIn) {
          // @ts-ignore - OrbitControls typing issue
          camera.position.z *= 0.98;
          camera.position.y *= 0.99;
          if (camera.position.z <= 3.5) {
            zoomingIn = false;
          }
        } else {
          // @ts-ignore - OrbitControls typing issue
          camera.position.z *= 1.02;
          camera.position.y *= 1.01;
          if (camera.position.z >= 8) {
            zoomingIn = true;
          }
        }
        controls.update();
      }, 150);
    };
    
    // Start the zoom effect after a delay
    const zoomEffectTimeout = setTimeout(() => {
      startZoomEffect();
    }, 3000);
    
    // Animation loop
    const clock = new THREE.Clock();
    let mixer: any = null; // This needs to be defined before use
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Update animations
      const delta = clock.getDelta();
      // @ts-ignore - mixer type issue
      if (mixer) mixer.update(delta);
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      // Clean up resources
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (zoomInterval) clearInterval(zoomInterval);
      clearTimeout(zoomEffectTimeout);
      
      renderer.dispose();
    };
  }, [toast, onLoad]);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />
      
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="relative w-64 h-6 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF5CC]"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-[#D4AF37] mt-2 font-light">
            Loading 3D Model... {loadingProgress}%
          </p>
        </div>
      )}
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4 opacity-80 z-10">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white">
          <span className="text-[#D4AF37]">Drag</span> to rotate
        </div>
        <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white">
          <span className="text-[#D4AF37]">Scroll</span> to zoom
        </div>
      </div>
    </div>
  );
}