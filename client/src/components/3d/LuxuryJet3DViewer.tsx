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
      // First try to create a renderer with all features
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
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
    
    // Create a more detailed and clearly recognizable jet model
    try {
      // Create group to hold all jet parts
      const jetGroup = new THREE.Group();
      
      // Create fuselage (main body) - more elongated
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2; // Rotate to horizontal
      jetGroup.add(body);
      
      // Create tapered nose cone
      const noseGeometry = new THREE.ConeGeometry(0.3, 1, 16);
      const noseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.2
      });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.rotation.z = -Math.PI / 2; // Rotate to point forward
      nose.position.set(2, 0, 0);
      jetGroup.add(nose);
      
      // Create main wings - more angled and realistic
      const wingsGeometry = new THREE.BoxGeometry(1.5, 0.05, 3);
      const wingsMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf0f0f0,
        metalness: 0.2,
        roughness: 0.3
      });
      const wings = new THREE.Mesh(wingsGeometry, wingsMaterial);
      wings.position.set(0, -0.1, 0);
      // Add slight backward sweep to wings
      wings.rotation.y = Math.PI * 0.03;
      jetGroup.add(wings);
      
      // Create vertical tail fin
      const tailFinGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.05);
      const tailFinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf0f0f0,
        metalness: 0.2,
        roughness: 0.3
      });
      const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
      tailFin.position.set(-1.8, 0.5, 0);
      jetGroup.add(tailFin);
      
      // Create horizontal stabilizers (tail wings)
      const stabilizerGeometry = new THREE.BoxGeometry(0.6, 0.05, 1.2);
      const stabilizerMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        metalness: 0.2,
        roughness: 0.3
      });
      const stabilizer = new THREE.Mesh(stabilizerGeometry, stabilizerMaterial);
      stabilizer.position.set(-1.8, 0.1, 0);
      jetGroup.add(stabilizer);
      
      // Create cockpit windows
      const cockpitGeometry = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI);
      const cockpitMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.5
      });
      const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
      cockpit.position.set(1.5, 0.15, 0);
      cockpit.rotation.z = Math.PI / 2;
      cockpit.rotation.y = Math.PI / 2;
      cockpit.scale.set(1, 0.6, 0.7);
      jetGroup.add(cockpit);
      
      // Create engines - more detailed with intake and exhaust
      const engineGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 16);
      const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.2
      });
      
      // Left engine
      const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
      leftEngine.rotation.z = Math.PI / 2;
      leftEngine.position.set(-0.5, -0.1, -1.2);
      jetGroup.add(leftEngine);
      
      // Engine intake (left)
      const intakeGeometry = new THREE.RingGeometry(0.05, 0.2, 16);
      const intakeMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        side: THREE.DoubleSide
      });
      const leftIntake = new THREE.Mesh(intakeGeometry, intakeMaterial);
      leftIntake.position.set(0.1, -0.1, -1.2);
      leftIntake.rotation.y = Math.PI / 2;
      jetGroup.add(leftIntake);
      
      // Engine exhaust (left) with glow
      const exhaustGeometry = new THREE.RingGeometry(0.05, 0.2, 16);
      const exhaustMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff2200,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
      });
      const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
      leftExhaust.position.set(-1.1, -0.1, -1.2);
      leftExhaust.rotation.y = Math.PI / 2;
      jetGroup.add(leftExhaust);
      
      // Right engine (clone left)
      const rightEngine = leftEngine.clone();
      rightEngine.position.set(-0.5, -0.1, 1.2);
      jetGroup.add(rightEngine);
      
      // Engine intake (right)
      const rightIntake = leftIntake.clone();
      rightIntake.position.set(0.1, -0.1, 1.2);
      jetGroup.add(rightIntake);
      
      // Engine exhaust (right)
      const rightExhaust = leftExhaust.clone();
      rightExhaust.position.set(-1.1, -0.1, 1.2);
      jetGroup.add(rightExhaust);
      
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