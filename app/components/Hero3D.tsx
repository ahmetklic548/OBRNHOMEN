"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Scroll izleyici ---------- */
function useScrollRef() {
  const ref = useRef(0);
  useEffect(() => {
    const h = () => { ref.current = window.scrollY; };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return ref;
}

/* ---------- Scroll kamera ---------- */
function ScrollCamera({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = Math.min(scrollRef.current / (window.innerHeight * 0.9), 1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.5 - p * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, p * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Malzemeler ─────────────────────────────────────────── */
const black  = new THREE.MeshStandardMaterial({ color: "#080808", roughness: 0.85, metalness: 0.05 });
const gold   = new THREE.MeshStandardMaterial({ color: "#c9a84c", roughness: 0.08, metalness: 0.97, envMapIntensity: 2.5 });
const bright = new THREE.MeshStandardMaterial({ color: "#ffd700", roughness: 0.04, metalness: 1.0,  envMapIntensity: 4 });
const marble = new THREE.MeshStandardMaterial({ color: "#e8dcc8", roughness: 0.4,  metalness: 0.0  });
const stone  = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.9,  metalness: 0.0  });

/* ── Kabe ───────────────────────────────────────────────── */
function Kaaba() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += 0.006; });

  /* Köşe sütunlarının konumları */
  const corners: [number, number][] = [
    [ 1.12,  1.12],
    [-1.12,  1.12],
    [ 1.12, -1.12],
    [-1.12, -1.12],
  ];

  return (
    <group ref={groupRef}>

      {/* ── Ana siyah küp (Kiswah) ── */}
      <mesh material={black} position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 2.8, 2.2]} />
      </mesh>

      {/* ── Hizam: geniş altın kuşak ── */}
      <mesh material={gold} position={[0, 0.6, 0]}>
        <boxGeometry args={[2.23, 0.28, 2.23]} />
      </mesh>
      {/* Hizam üst çizgisi */}
      <mesh material={bright} position={[0, 0.75, 0]}>
        <boxGeometry args={[2.24, 0.03, 2.24]} />
      </mesh>
      {/* Hizam alt çizgisi */}
      <mesh material={bright} position={[0, 0.45, 0]}>
        <boxGeometry args={[2.24, 0.03, 2.24]} />
      </mesh>

      {/* ── Altın kapı (Bab al-Kaaba) ── */}
      {/* Dış çerçeve */}
      <mesh material={gold} position={[0, 0.22, 1.115]}>
        <boxGeometry args={[0.72, 1.12, 0.018]} />
      </mesh>
      {/* İç altın panel */}
      <mesh material={bright} position={[0, 0.22, 1.122]}>
        <boxGeometry args={[0.58, 0.96, 0.012]} />
      </mesh>
      {/* Kapı kolu */}
      <mesh material={bright} position={[0, 0.18, 1.135]}>
        <boxGeometry args={[0.06, 0.22, 0.025]} />
      </mesh>

      {/* ── Hajar al-Aswad (Siyah Taş) — sağ ön köşede ── */}
      <mesh material={stone} position={[1.1, -0.55, 1.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      {/* Taş çerçevesi */}
      <mesh material={bright} position={[1.1, -0.55, 1.1]}>
        <torusGeometry args={[0.13, 0.025, 12, 24]} />
      </mesh>

      {/* ── Köşe sütunları (Arkan) ── */}
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={gold}>
            <cylinderGeometry args={[0.07, 0.07, 2.85, 12]} />
          </mesh>
          {/* Sütun başlığı */}
          <mesh material={bright} position={[0, 1.47, 0]}>
            <cylinderGeometry args={[0.1, 0.07, 0.1, 12]} />
          </mesh>
        </group>
      ))}

      {/* ── Üst altın bordür ── */}
      <mesh material={bright} position={[0, 1.42, 0]}>
        <boxGeometry args={[2.24, 0.04, 2.24]} />
      </mesh>

      {/* ── Mermer zemin platformu ── */}
      <mesh material={marble} position={[0, -1.48, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 0.1, 64]} />
      </mesh>
      {/* Dış çember çizgisi */}
      <mesh material={gold} position={[0, -1.42, 0]}>
        <torusGeometry args={[2.8, 0.03, 8, 80]} />
      </mesh>

      {/* ── Maqam Ibrahim (küçük altın kafes) — önde ── */}
      <mesh material={gold} position={[0, -1.1, 2.2]}>
        <boxGeometry args={[0.28, 0.36, 0.28]} />
      </mesh>
      <mesh material={bright} position={[0, -0.92, 2.2]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
      </mesh>

      {/* ── Kabe etrafında atmosferik ışık ── */}
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#ffd700" distance={4} />
      <pointLight position={[0, -1, 2.5]} intensity={0.8} color="#c9a84c" distance={3} />
    </group>
  );
}

/* ---------- Sahne ---------- */
function Scene({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[6, 6, 6]} intensity={5} color="#ffd700" />
      <pointLight position={[-5, -3, 3]} intensity={1.5} color="#ff9500" />
      <pointLight position={[0, -6, 2]} intensity={0.8} color="#c9a84c" />

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      <Kaaba />

      <Sparkles count={60} size={1.6} speed={0.25} opacity={0.5} color="#ffd700" scale={10} />
      <Stars radius={28} depth={10} count={300} factor={2} saturation={0} fade speed={0.4} />
      <ScrollCamera scrollRef={scrollRef} />
    </>
  );
}

export default function Hero3D() {
  const scrollRef = useScrollRef();
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.5], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[0.7, 1]}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
