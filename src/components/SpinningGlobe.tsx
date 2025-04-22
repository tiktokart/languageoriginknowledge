
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Separate GlobeObject component that will live inside the Canvas
const GlobeObject: React.FC = () => {
  // Using a group ref for the rotation
  const groupRef = React.useRef<THREE.Group>(null!);

  // Animate rotation of globe - using useEffect instead of useFrame
  React.useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.0032;
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Several "lights" as glowing points (using colored Spheres)
  // Example: 8 random locations, with colors from palette
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

  // Animated light component - now uses useEffect for animation instead of useFrame
  function AnimatedLight({
    position,
    color,
    i,
  }: {
    position: [number, number, number];
    color: string;
    i: number;
  }) {
    const lightRef = React.useRef<THREE.Mesh>(null!);
    
    React.useEffect(() => {
      let animationId: number;
      let startTime = Date.now();
      
      const animate = () => {
        if (lightRef.current) {
          const t = (Date.now() - startTime) / 1000 + i;
          lightRef.current.scale.setScalar(0.5 + Math.abs(Math.sin(t * 1.7)) * 1.1);
        }
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    }, [i]);
    
    return (
      <mesh ref={lightRef} position={position}>
        <sphereGeometry args={[0.08, 18, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Sphere with blue/purple gradient */}
      <Sphere args={[1.2, 48, 32]}>
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
          position={latLngToXYZ(pt.lat, pt.lng, 1.23)}
        />
      ))}
    </group>
  );
};

// Main component that wraps everything in Canvas
const SpinningGlobe: React.FC = () => {
  return (
    <div className="w-full h-[360px] relative">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 38 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Globe sphere */}
        <ambientLight intensity={0.32} />
        <directionalLight position={[-5, 3, 5]} intensity={0.45} color={"#ffe3b8"} />
        <directionalLight position={[6, -2, -8]} intensity={0.27} color={"#6493f7"} />
        <GlobeObject />
        {/* Subtle shadow under globe */}
        <mesh position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.1, 36]} />
          <meshBasicMaterial color="#2a2254" transparent opacity={0.11} />
        </mesh>
        {/* Orbit controls enabled, zoom disabled for clean UX */}
        <OrbitControls enableZoom={false} minPolarAngle={0.5} maxPolarAngle={2.6} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
};

export default SpinningGlobe;
