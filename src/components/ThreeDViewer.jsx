import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Suspense, useEffect, useRef } from 'react'

function Model({ scale = 1 }) {
  const { scene } = useGLTF('./deion12.glb')
  const ref = useRef()

  useEffect(() => {
    // Premium stainless steel material
    const stainlessMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd9d9d9), // Medium bright silver
      metalness: 0.75,    // Highly metallic
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
  return (
    <Canvas
      shadows
      camera={{ position: [3, 2, 5], fov: 45 }}
      gl={{ 
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding,
        antialias: true
      }}
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

      <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
        {/* Studio environment for better reflections */}
        <Environment 
          preset="studio"
          background={false}
          resolution={512}
        />

        <Model scale={scale} />

        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.55}
          scale={10}
          blur={2.5}
          far={4}
          color="#202020"
        />
      </Suspense>

      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        minPolarAngle={Math.PI/6}
        maxPolarAngle={Math.PI/1.8}
        // autoRotate={true}
        // autoRotateSpeed={0.8}
      />
    </Canvas>
  )
}