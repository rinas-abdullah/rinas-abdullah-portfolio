import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

const CoreGeometry = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * (hovered ? 0.05 : 0.18);
    groupRef.current.rotation.x += delta * 0.04;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#4f46e5"
          wireframe
          emissive="#6366f1"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh scale={0.94}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#818cf8"
          transparent
          opacity={0.06}
          roughness={0.3}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
};

const HeroScene = () => {
  return (
    <div className="relative w-full h-[320px] sm:h-[420px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 3, 4]} intensity={1.1} color="#6366f1" />
          <pointLight position={[-3, -2, -2]} intensity={0.6} color="#a78bfa" />
          <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
            <CoreGeometry />
          </Float>
          <Sparkles count={60} scale={5} size={2} speed={0.3} color="#818cf8" opacity={0.6} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            rotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
