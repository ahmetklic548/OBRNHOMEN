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
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7 - p * 2.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.8 + p * 1.5, 0.04);
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

/* ── Malzemeler ─────────────────────────────────────────── */
const kiswa  = new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.92, metalness: 0.03 });
const gold   = new THREE.MeshStandardMaterial({ color: "#c9a84c", roughness: 0.1,  metalness: 0.95, envMapIntensity: 3 });
const bright = new THREE.MeshStandardMaterial({ color: "#ffd700", roughness: 0.03, metalness: 1.0,  envMapIntensity: 5 });
const marble = new THREE.MeshStandardMaterial({ color: "#ddd5c0", roughness: 0.35, metalness: 0.0 });
const stone  = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.95, metalness: 0.0 });
const darkGold = new THREE.MeshStandardMaterial({ color: "#a07830", roughness: 0.15, metalness: 0.9, envMapIntensity: 2 });

/* ── Kabe ───────────────────────────────────────────────── */
function Kaaba() {
  const groupRef = useRef<THREE.Group>(null);

  /* Yavaş dönüş */
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.004;
  });

  /* Kiswah üzerinde yatay altın çizgiler (kumaş izlenimi) */
  const fabricLines = [-0.9, -0.3, 0.3, 1.0];

  return (
    <group ref={groupRef}>

      {/* ── Ana Kabe gövdesi (Kiswah) — daha gerçekçi oran ── */}
      <mesh material={kiswa} position={[0, 0.1, 0]}>
        <boxGeometry args={[2.4, 3.2, 2.15]} />
      </mesh>

      {/* ── Kiswah kumaş çizgileri (dekoratif yatay bantlar) ── */}
      {fabricLines.map((y, i) => (
        <mesh key={i} material={darkGold} position={[0, y, 0]}>
          <boxGeometry args={[2.42, 0.018, 2.17]} />
        </mesh>
      ))}

      {/* ── Hizam: kalın altın kuşak ── */}
      <mesh material={gold} position={[0, 0.85, 0]}>
        <boxGeometry args={[2.43, 0.34, 2.16]} />
      </mesh>
      {/* Hizam üst şerit */}
      <mesh material={bright} position={[0, 1.03, 0]}>
        <boxGeometry args={[2.44, 0.035, 2.17]} />
      </mesh>
      {/* Hizam alt şerit */}
      <mesh material={bright} position={[0, 0.67, 0]}>
        <boxGeometry args={[2.44, 0.035, 2.17]} />
      </mesh>
      {/* Hizam Arapça yazı simülasyonu — ince dikey çizgiler */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} material={bright} position={[x, 0.85, 1.085]}>
          <boxGeometry args={[0.06, 0.22, 0.005]} />
        </mesh>
      ))}

      {/* ── Kapı çerçevesi (Bab al-Kaaba) — yükseltilmiş ── */}
      {/* Dış altın çerçeve */}
      <mesh material={gold} position={[0, 0.6, 1.078]}>
        <boxGeometry args={[0.78, 1.4, 0.02]} />
      </mesh>
      {/* İç parlak panel */}
      <mesh material={bright} position={[0, 0.6, 1.088]}>
        <boxGeometry args={[0.62, 1.22, 0.014]} />
      </mesh>
      {/* Kapı orta çizgisi */}
      <mesh material={gold} position={[0, 0.6, 1.095]}>
        <boxGeometry args={[0.04, 1.1, 0.01]} />
      </mesh>
      {/* Kapı üst yay simülasyonu */}
      <mesh material={bright} position={[0, 1.28, 1.088]}>
        <boxGeometry args={[0.62, 0.08, 0.012]} />
      </mesh>

      {/* ── Hajar al-Aswad (Siyah Taş) ── */}
      <mesh material={stone} position={[1.21, -0.5, 1.08]}>
        <sphereGeometry args={[0.1, 20, 20]} />
      </mesh>
      {/* Oval altın çerçeve */}
      <mesh material={bright} position={[1.21, -0.5, 1.08]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.14, 0.028, 16, 32]} />
      </mesh>

      {/* ── Üst altın kenar bordürü ── */}
      <mesh material={bright} position={[0, 1.71, 0]}>
        <boxGeometry args={[2.44, 0.045, 2.17]} />
      </mesh>
      {/* Çatı yüzeyi — hafif gri */}
      <mesh material={marble} position={[0, 1.74, 0]}>
        <boxGeometry args={[2.4, 0.04, 2.15]} />
      </mesh>

      {/* ── Geniş mermer tavafsah platformu ── */}
      <mesh material={marble} position={[0, -1.52, 0]}>
        <cylinderGeometry args={[3.8, 3.8, 0.12, 80]} />
      </mesh>
      {/* İç çember */}
      <mesh material={darkGold} position={[0, -1.455, 0]}>
        <torusGeometry args={[2.0, 0.025, 12, 100]} />
      </mesh>
      {/* Dış çember */}
      <mesh material={gold} position={[0, -1.455, 0]}>
        <torusGeometry args={[3.7, 0.03, 12, 100]} />
      </mesh>

      {/* ── Maqam Ibrahim ── */}
      <mesh material={gold} position={[0, -1.18, 2.8]}>
        <boxGeometry args={[0.3, 0.42, 0.3]} />
      </mesh>
      <mesh material={bright} position={[0, -0.96, 2.8]}>
        <boxGeometry args={[0.34, 0.05, 0.34]} />
      </mesh>
      {/* Maqam üstü küçük kubbe */}
      <mesh material={gold} position={[0, -0.92, 2.8]}>
        <sphereGeometry args={[0.1, 12, 8]} />
      </mesh>

      {/* ── Zemzem kuyusu (küçük yuvarlak kap) ── */}
      <mesh material={marble} position={[-1.8, -1.46, 1.5]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 20]} />
      </mesh>

      {/* ── Kabe etrafı ışık ── */}
      <pointLight position={[0, 2.5, 0]}   intensity={2}   color="#ffd700" distance={5} />
      <pointLight position={[0, -0.5, 3]}  intensity={1.2} color="#c9a84c" distance={4} />
      <pointLight position={[-2, 1, -2]}   intensity={0.6} color="#ff8800" distance={4} />
    </group>
  );
}

/* ---------- Sahne ---------- */
function Scene({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[8, 8, 8]}   intensity={6}   color="#ffd700" />
      <pointLight position={[-6, -4, 4]} intensity={1.8} color="#ff9500" />
      <pointLight position={[0, -8, 3]}  intensity={1.0} color="#c9a84c" />

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      <Kaaba />

      <Sparkles count={30} size={1.5} speed={0.2} opacity={0.45} color="#ffd700" scale={12} />
      <Stars radius={30} depth={12} count={150} factor={2} saturation={0} fade speed={0.35} />
      <ScrollCamera scrollRef={scrollRef} />
    </>
  );
}

export default function Hero3D() {
  const scrollRef = useScrollRef();
  return (
    <Canvas
      camera={{ position: [0, 1, 7], fov: 44 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[0.7, 1]}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
