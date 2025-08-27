import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, Stats } from '@react-three/drei'
import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import './ThreeDViewer.css'
import RASPBERRY_PI_CONFIG from '../config/raspberryPi.js'

function Model({ scale = 1 }) {
  const { scene } = useGLTF('./deion12.glb', {
    // Optimize loading for Raspberry Pi
    // draco: {
    //   decoderPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/',
    // },
  })
  const ref = useRef()

  useEffect(() => {
    // Premium stainless steel material
    const stainlessMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd9d9d9), // Medium bright silver
      metalness: 0.6,    // Highly metallic
      roughness: 0.2,    // Slightly rough for realistic metal
      envMapIntensity: 1.8,
      side: THREE.DoubleSide
    })

    scene.traverse((child) => {
      if (child.isMesh) {
        // Ensure proper geometry rendering
        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals()
        }
        
        // Dispose old materials to prevent memory leaks
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose())
          } else {
            child.material.dispose()
          }
        }
        
        // Apply new material
        child.material = stainlessMaterial.clone()
        child.castShadow = true;
        child.receiveShadow = true;
      }
    })
  }, [scene])

  return <primitive ref={ref} object={scene} scale={scale} position={[0, -0.5, 0]} rotation={[0, Math.PI/4, 0]} />
}

export default function ThreeDViewer({ scale = 1 }) {
  // State to track viewport dimensions
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  // Get optimal settings based on device detection
  const [optimalSettings] = useState(RASPBERRY_PI_CONFIG.getOptimalSettings())
  
  // State to track if running on Raspberry Pi
  const [isRaspberryPi] = useState(RASPBERRY_PI_CONFIG.isRaspberryPi())
  
  // State to show/hide performance stats
  const [showStats, setShowStats] = useState(RASPBERRY_PI_CONFIG.performance.showFPS)
  
  // Effect to handle viewport resizing
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize)
    
    // Add keyboard shortcut to toggle stats (press 'p')
    const handleKeyDown = (e) => {
      if (e.key === 'p') {
        setShowStats(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  // Calculate camera FOV based on screen size - smaller screens get wider FOV
  const dynamicFov = viewportSize.width < 768 ? 60 : 45
  
  // Adjust scale for smaller screens and for Raspberry Pi
  const responsiveScale = isRaspberryPi
    ? scale * 0.9 // Slightly smaller on Raspberry Pi for better performance
    : viewportSize.width < 768 ? scale * 0.8 : scale
  
  return (
    <div className="threeDViewer-container w-full h-full relative">
      <Canvas
        shadows={!isRaspberryPi || optimalSettings.shadowMapEnabled}
        camera={{ 
          position: [3, 2, 5], 
          fov: dynamicFov,
          // Optimize for Raspberry Pi 5 HDMI output
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          antialias: optimalSettings.antialias,
          // Optimize performance for Raspberry Pi 5
          powerPreference: 'high-performance',
          precision: optimalSettings.precision
        }}
        // Optimize performance
        frameloop={optimalSettings.frameloop}
        dpr={optimalSettings.pixelRatio} // Use optimal pixel ratio for device
      >
      <color attach="background" args={['#ffffff']} />
      
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.35} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight 
        position={[-5, 3, -3]} 
        intensity={0.8} 
        color="#88c0ff" 
      />
      <hemisphereLight intensity={0.2} color="#ffffff" groundColor="#ffffff" />

      <Suspense fallback={<Html center><div className="threeDViewer-loading">Loading 3D Model...</div></Html>}>
        {/* Studio environment for better reflections - optimized for performance */}
        <Environment 
          files="/studio_small_03_1k.hdr" 
          background={false}
          // Fallback preset if HDR fails to load
        />

        <Model scale={responsiveScale} />

        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.55}
          scale={10}
          blur={2.5}
          far={4}
          color="#202020"
          // Optimize for performance
          resolution={256}
        />
      </Suspense>

      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        minPolarAngle={Math.PI/6}
        maxPolarAngle={Math.PI/1.8}
        // Enable touch controls for Raspberry Pi touchscreen compatibility
        enableDamping={true}
        dampingFactor={isRaspberryPi ? 0.1 : 0.05} // Higher damping for Raspberry Pi
        rotateSpeed={isRaspberryPi ? RASPBERRY_PI_CONFIG.input.touchRotateSensitivity : 0.8}
        zoomSpeed={isRaspberryPi ? RASPBERRY_PI_CONFIG.input.touchZoomSensitivity : 0.8}
        // Optimize for touch interfaces
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
        // autoRotate={true}
        // autoRotateSpeed={0.8}
      />
      
      {/* Performance stats - toggle with 'p' key */}
      {showStats && <Stats />}
    </Canvas>
    
    {/* Responsive UI overlay with instructions - helpful for touch interfaces */}
    <div className="threeDViewer-controls-hint">
      Drag to rotate • Pinch to zoom {isRaspberryPi && '• Press P for stats'}
    </div>
    
    {/* Raspberry Pi indicator */}
    {isRaspberryPi && (
      <div className="absolute top-2 right-2 text-xs text-white bg-green-600 bg-opacity-70 p-1 rounded pointer-events-none">
        Raspberry Pi Mode
      </div>
    )}
  </div>
  )
}