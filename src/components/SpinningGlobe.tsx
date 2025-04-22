
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Separate GlobeObject component that will live inside the Canvas
const GlobeObject: React.FC = () => {
  // Using a group ref for the rotation
  const groupRef = React.useRef<THREE.Group>(null);

  // Use useFrame instead of useEffect for animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // Even slower rotation for stability
    }
  });

  // Several "lights" as glowing points (using colored Spheres)
  const lights = [
    { lat: 36, lng: -120, color: "#9b87f5" }, // US
    { lat: -30, lng: 142, color: "#F97316" }, // Australia
    { lat: 51, lng: 10, color: "#8B5CF6" },  // Europe
    { lat: 28, lng: 84, color: "#33C3F0" },  // Asia
    { lat: -14, lng: -52, color: "#0EA5E9" }, // South America
    { lat: 8, lng: 3, color: "#1EAEDB" },   // Africa
    { lat: 61, lng: 100, color: "#6E59A5" }, // Siberia
    { lat: 40, lng: -3, color: "#F97316" }, // Spain
  ];

  // Convert lat/lng to xyz on sphere of given radius
  const latLngToXYZ = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return [
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ] as [number, number, number];
  };

  // Animated light component using useFrame
  function AnimatedLight({
    position,
    color,
    i,
  }: {
    position: [number, number, number];
    color: string;
    i: number;
  }) {
    const lightRef = React.useRef<THREE.Mesh>(null);
    const [startTime] = React.useState(() => Date.now());
    
    useFrame(() => {
      if (lightRef.current) {
        const t = (Date.now() - startTime) / 1000 + i;
        // More pronounced pulsing
        lightRef.current.scale.setScalar(0.4 + Math.abs(Math.sin(t * 1.2)) * 1.3); 
      }
    });
    
    return (
      <mesh ref={lightRef} position={position}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Sphere with blue/purple gradient */}
      <Sphere args={[1.2, 36, 24]}>
        <meshStandardMaterial
          color="#364182"
          roughness={0.35}
          metalness={0.11}
          transparent
          opacity={0.98}
        />
      </Sphere>
      {/* Animated language "lights" */}
      {lights.map((pt, i) => (
        <AnimatedLight
          key={i}
          i={i}
          color={pt.color}
          position={latLngToXYZ(pt.lat, pt.lng, 1.25)}
        />
      ))}
    </group>
  );
};

// Main component that wraps everything in Canvas
const SpinningGlobe: React.FC = () => {
  return (
    <div className="w-full h-[400px] bg-[#1A1F2C] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 38 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
      >
        <React.Suspense fallback={null}>
          {/* Globe sphere */}
          <ambientLight intensity={0.35} />
          <directionalLight position={[-5, 3, 5]} intensity={0.45} color="#ffe3b8" />
          <directionalLight position={[6, -2, -8]} intensity={0.3} color="#6493f7" />
          <GlobeObject />
          {/* Subtle shadow under globe */}
          <mesh position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.1, 32]} />
            <meshBasicMaterial color="#2a2254" transparent opacity={0.11} />
          </mesh>
          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={0.5} 
            maxPolarAngle={2.6} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={0.4} 
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default SpinningGlobe;
