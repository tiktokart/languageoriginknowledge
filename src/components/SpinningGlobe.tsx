
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Animate rotation of globe
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0032;
    }
  });

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

  // Animated light scale for pulsing effect
  function AnimatedLight({
    position,
    color,
    i,
  }: {
    position: [number, number, number];
    color: string;
    i: number;
  }) {
    const lightRef = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
      if (lightRef.current) {
        const t = clock.getElapsedTime() + i;
        lightRef.current.scale.setScalar(0.5 + Math.abs(Math.sin(t * 1.7)) * 1.1);
      }
    });
    return (
      <mesh ref={lightRef} position={position}>
        <sphereGeometry args={[0.08, 18, 16]} />
        <meshBasicMaterial color={color} emissive={color} />
      </mesh>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 38 }}
      style={{ width: "100%", height: "360px" }}
    >
      {/* Globe sphere */}
      <ambientLight intensity={0.32} />
      <directionalLight position={[-5, 3, 5]} intensity={0.45} color={"#ffe3b8"} />
      <directionalLight position={[6, -2, -8]} intensity={0.27} color={"#6493f7"} />
      <group ref={meshRef}>
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
      {/* Subtle shadow under globe */}
      <mesh position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 36]} />
        <meshBasicMaterial color="#2a2254" transparent opacity={0.11} />
      </mesh>
      {/* Orbit controls enabled, zoom disabled for clean UX */}
      <OrbitControls enableZoom={false} minPolarAngle={0.5} maxPolarAngle={2.6} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
};

export default Globe;
