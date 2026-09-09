import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Environment, Lightformer, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Line2 } from 'three-stdlib';

const POINT_COUNT = 9;
const SEGMENT_LENGTH = 0.42;
const ANCHOR = new THREE.Vector3(0, 3.4, 0);
const GRAVITY = new THREE.Vector3(0, -9.5, 0);

function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const drops: { x: number; y: number; len: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent?.clientWidth ?? window.innerWidth;
      height = canvas.height = parent?.clientHeight ?? window.innerHeight;
      drops.length = 0;
      const count = Math.floor((width * height) / 9000);
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          len: 14 + Math.random() * 26,
          speed: 3 + Math.random() * 5,
          opacity: 0.08 + Math.random() * 0.22,
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#67e8f9';
      ctx.lineCap = 'round';
      for (const d of drops) {
        ctx.globalAlpha = d.opacity;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.08, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= d.speed * 0.08;
        if (d.y > height) {
          d.y = -d.len;
          d.x = Math.random() * width;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70" />;
}

/** Lightweight Verlet-integrated rope — avoids pulling in a full WASM physics
 * engine (rapier) just to hang one card, which proved unstable/crash-prone
 * under constrained WebGL contexts. */
class RopeSim {
  points: THREE.Vector3[];
  prevPoints: THREE.Vector3[];
  pinned: boolean[];

  constructor(count: number, anchor: THREE.Vector3, segmentLength: number) {
    this.points = [];
    this.prevPoints = [];
    this.pinned = [];
    for (let i = 0; i < count; i++) {
      const p = anchor.clone().add(new THREE.Vector3(0, -i * segmentLength, 0));
      this.points.push(p.clone());
      this.prevPoints.push(p.clone());
      this.pinned.push(i === 0);
    }
  }

  step(dt: number, dragIndex: number | null, dragTarget: THREE.Vector3 | null) {
    const damping = 0.985;
    for (let i = 0; i < this.points.length; i++) {
      if (this.pinned[i]) continue;
      if (dragIndex !== null && i === dragIndex && dragTarget) {
        this.prevPoints[i].copy(this.points[i]);
        this.points[i].copy(dragTarget);
        continue;
      }
      const p = this.points[i];
      const prev = this.prevPoints[i];
      const velocity = p.clone().sub(prev).multiplyScalar(damping);
      const next = p.clone().add(velocity).add(GRAVITY.clone().multiplyScalar(dt * dt));
      this.prevPoints[i].copy(p);
      this.points[i].copy(next);
    }

    for (let iter = 0; iter < 6; iter++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const a = this.points[i];
        const b = this.points[i + 1];
        const delta = b.clone().sub(a);
        const dist = delta.length() || 0.0001;
        const diff = (dist - SEGMENT_LENGTH) / dist;
        const offset = delta.multiplyScalar(0.5 * diff);
        if (!this.pinned[i] && !(dragIndex === i)) a.add(offset);
        if (!this.pinned[i + 1] && !(dragIndex === i + 1)) b.sub(offset);
      }
      this.points[0].copy(ANCHOR);
    }
  }
}

const Card = ({ onDragStateChange }: { onDragStateChange: (dragging: boolean) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<Line2>(null);
  const rope = useMemo(() => new RopeSim(POINT_COUNT, ANCHOR, SEGMENT_LENGTH), []);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const { camera } = useThree();
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPoint = useRef(new THREE.Vector3());
  const lastEnd = useRef(ANCHOR.clone());

  useEffect(() => {
    const release = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setDragging(false);
      onDragStateChange(false);
    };
    window.addEventListener('pointerup', release);
    return () => window.removeEventListener('pointerup', release);
  }, [onDragStateChange]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const lastIdx = POINT_COUNT - 1;

    if (draggingRef.current) {
      raycaster.setFromCamera(state.pointer, camera);
      raycaster.ray.intersectPlane(dragPlane, dragPoint.current);
    }

    rope.step(dt, draggingRef.current ? lastIdx : null, draggingRef.current ? dragPoint.current : null);

    if (lineRef.current) {
      lineRef.current.geometry.setPositions(rope.points.flatMap((p) => [p.x, p.y, p.z]));
    }

    const end = rope.points[lastIdx];
    const prev = rope.points[lastIdx - 1];
    if (groupRef.current) {
      groupRef.current.position.copy(end);
      const dir = end.clone().sub(prev).normalize();
      const swing = Math.atan2(dir.x, -dir.y);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -swing * 0.6, 0.15);
      const velocity = end.clone().sub(lastEnd.current);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -velocity.x * 4, 0.1);
      lastEnd.current.copy(end);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    draggingRef.current = true;
    setDragging(true);
    onDragStateChange(true);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    draggingRef.current = false;
    setDragging(false);
    onDragStateChange(false);
  };

  return (
    <>
      <Line
        ref={lineRef}
        points={rope.points.map((p) => [p.x, p.y, p.z]) as [number, number, number][]}
        color="#334155"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />
      <group
        ref={groupRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMissed={() => { if (dragging) { draggingRef.current = false; setDragging(false); onDragStateChange(false); } }}
      >
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[1.6, 2.05, 0.06]} />
          <meshPhysicalMaterial
            color="#0b1220"
            metalness={0.75}
            roughness={0.18}
            iridescence={1}
            iridescenceIOR={1.35}
            iridescenceThicknessRange={[100, 500]}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={1.4}
          />
        </mesh>
        <mesh position={[0, 0.05, 0.01]}>
          <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
        </mesh>
        <Html transform position={[0, -0.45, 0.035]} distanceFactor={2.1} occlude={false} pointerEvents="none" className="select-none">
          <div style={{ width: 300, height: 385 }} className="flex flex-col items-center justify-between p-6 font-mono">
            <div className="w-full flex justify-between items-center">
              <span className="text-cyan-300 text-[10px] tracking-[0.2em] font-bold">RINAS//OS</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[8px] tracking-widest font-bold">ONLINE</span>
              </span>
            </div>
            <div className="w-20 h-20 rounded-full border-2 border-cyan-400/60 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 flex items-center justify-center">
              <span className="text-white font-black text-2xl">R</span>
            </div>
            <div className="text-center">
              <div className="text-white font-black text-lg tracking-wide">RINAS ABDULLAH</div>
              <div className="text-cyan-300 text-[9px] tracking-[0.15em] font-semibold mt-1">CYBERSECURITY & AI ARCHITECT</div>
              <div className="text-slate-400 text-[8px] tracking-wide mt-2">KAU · FIRST CLASS HONORS · 4.96/5.00</div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="grid grid-cols-4 gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 ${i % 3 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                ))}
              </div>
              <span className="text-slate-500 text-[7px] tracking-widest">SECURE</span>
            </div>
          </div>
        </Html>
      </group>
    </>
  );
};

const LanyardBadge = () => {
  const [, setDragging] = useState(false);

  return (
    <div className="relative w-full h-[420px] sm:h-[520px]">
      <RainBackground />
      <Canvas camera={{ position: [0, 0, 8], fov: 30 }} dpr={1} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} color="#67e8f9" />
        <directionalLight position={[-3, -2, 2]} intensity={0.6} color="#a78bfa" />
        <Card onDragStateChange={setDragging} />
        <Environment resolution={32} frames={1}>
          <group>
            <Lightformer intensity={2} color="#67e8f9" position={[0, 4, -3]} scale={[6, 2, 1]} />
            <Lightformer intensity={1.5} color="#8b5cf6" position={[-4, -2, -2]} scale={[4, 3, 1]} />
            <Lightformer intensity={1} color="white" position={[3, 1, 4]} scale={[2, 4, 1]} />
          </group>
        </Environment>
      </Canvas>
    </div>
  );
};

export default LanyardBadge;
