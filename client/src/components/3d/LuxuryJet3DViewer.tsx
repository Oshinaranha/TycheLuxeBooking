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
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Second directional light from the other side
    const directionalLight2 = new THREE.DirectionalLight(0xd4af37, 0.8);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    
    // Add point light for highlights
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 2, 5);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    // @ts-ignore - Three.js typings mismatch
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Create a simplified jet model with a few parts
    try {
      // Create group to hold all jet parts
      const jetGroup = new THREE.Group();
      
      // Create body
      const bodyGeometry = new THREE.BoxGeometry(2, 0.4, 0.4);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xeeeeee,
        shininess: 90
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      jetGroup.add(body);
      
      // Create wings
      const wingsGeometry = new THREE.BoxGeometry(0.8, 0.05, 1.6);
      const wingsMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xdddddd,
        shininess: 70
      });
      const wings = new THREE.Mesh(wingsGeometry, wingsMaterial);
      wings.position.set(0, -0.1, 0);
      jetGroup.add(wings);
      
      // Create tail
      const tailGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.05);
      const tailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xdddddd 
      });
      const tail = new THREE.Mesh(tailGeometry, tailMaterial);
      tail.position.set(-0.8, 0.15, 0);
      jetGroup.add(tail);
      
      // Create cockpit (nose)
      const cockpitGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      });
      const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
      cockpit.position.set(1.0, 0, 0);
      cockpit.scale.set(1, 0.7, 0.7);
      jetGroup.add(cockpit);
      
      // Create engines
      const engineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
      const engineMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        shininess: 30
      });
      
      // Left engine
      const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
      leftEngine.rotation.z = Math.PI / 2;
      leftEngine.position.set(-0.3, -0.1, -0.6);
      jetGroup.add(leftEngine);
      
      // Right engine
      const rightEngine = leftEngine.clone();
      rightEngine.position.set(-0.3, -0.1, 0.6);
      jetGroup.add(rightEngine);
      
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