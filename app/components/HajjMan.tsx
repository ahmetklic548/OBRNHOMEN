"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ── Malzemeler ─────────────────────────────────── */
const skin    = new THREE.MeshStandardMaterial({ color: "#c49a6c", roughness: 0.65, metalness: 0 });
const skinDark= new THREE.MeshStandardMaterial({ color: "#a07848", roughness: 0.65, metalness: 0 });
const ihram   = new THREE.MeshStandardMaterial({ color: "#f8f4ee", roughness: 0.95, metalness: 0 });
const ihramS  = new THREE.MeshStandardMaterial({ color: "#ede8e0", roughness: 0.95, metalness: 0 });
const beard   = new THREE.MeshStandardMaterial({ color: "#1e1610", roughness: 0.85, metalness: 0 });
const eyeM    = new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.5,  metalness: 0 });
const lip     = new THREE.MeshStandardMaterial({ color: "#8b5e52", roughness: 0.7,  metalness: 0 });
const turban  = new THREE.MeshStandardMaterial({ color: "#f5f0e8", roughness: 0.9,  metalness: 0 });
const turbanS = new THREE.MeshStandardMaterial({ color: "#e8e2d8", roughness: 0.9,  metalness: 0 });

/* ── Scroll tespiti ─────────────────────────────── */
function useScrollState() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [pastHero,    setPastHero]    = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const h = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.45);
      setIsScrolling(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsScrolling(false), 180);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => { window.removeEventListener("scroll", h); };
  }, []);

  return { isScrolling, pastHero };
}

/* ── Bacak ──────────────────────────────────────── */
function Leg({ side, thighRef, shinRef }: {
  side: 1 | -1;
  thighRef: React.RefObject<THREE.Group | null>;
  shinRef:  React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={thighRef} position={[side * 0.12, 0.42, 0]}>
      <mesh material={ihram} position={[0, -0.19, 0]}>
        <cylinderGeometry args={[0.095, 0.082, 0.4, 14]} />
      </mesh>
      <mesh material={skinDark} position={[0, -0.41, 0]}>
        <sphereGeometry args={[0.072, 12, 12]} />
      </mesh>
      <group ref={shinRef} position={[0, -0.41, 0]}>
        <mesh material={skin} position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.068, 0.052, 0.38, 14]} />
        </mesh>
        <mesh material={skin} position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
        <mesh material={skinDark} position={[side * 0.01, -0.44, 0.07]}>
          <boxGeometry args={[0.1, 0.055, 0.2]} />
        </mesh>
        <mesh material={skinDark} position={[side * 0.01, -0.455, 0.16]}>
          <sphereGeometry args={[0.042, 10, 10]} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Kol ────────────────────────────────────────── */
function Arm({ side, armRef }: {
  side: 1 | -1;
  armRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={armRef} position={[side * 0.27, 1.16, 0]}>
      <mesh material={ihram} position={[0, 0, 0]}>
        <sphereGeometry args={[0.085, 12, 12]} />
      </mesh>
      <mesh material={ihram} position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.068, 0.058, 0.32, 12]} />
      </mesh>
      <mesh material={skin} position={[0, -0.34, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
      </mesh>
      <mesh material={skin} position={[0, -0.50, 0]}>
        <cylinderGeometry args={[0.052, 0.042, 0.28, 12]} />
      </mesh>
      <mesh material={skinDark} position={[0, -0.66, 0.02]}>
        <boxGeometry args={[0.075, 0.1, 0.055]} />
      </mesh>
    </group>
  );
}

/* ── İhram sarığı (baş bezi) ────────────────────── */
function Turban({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Ana sarık kütlesi */}
      <mesh material={turban} position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.195, 16, 16]} />
      </mesh>
      {/* Üst düz bölüm */}
      <mesh material={turbanS} position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 0.08, 14]} />
      </mesh>
      {/* Sarık katmanı 1 */}
      <mesh material={ihramS} position={[0, 0.04, 0]} rotation={[0.15, 0.3, 0]}>
        <torusGeometry args={[0.16, 0.032, 8, 28]} />
      </mesh>
      {/* Sarık katmanı 2 */}
      <mesh material={turban} position={[0, 0.10, 0]} rotation={[-0.1, 0.6, 0]}>
        <torusGeometry args={[0.15, 0.028, 8, 28]} />
      </mesh>
      {/* Sarık katmanı 3 */}
      <mesh material={ihramS} position={[0, 0.16, 0]} rotation={[0.05, -0.2, 0]}>
        <torusGeometry args={[0.135, 0.025, 8, 28]} />
      </mesh>
      {/* Sarkık uç (arkada) */}
      <mesh material={turban} position={[-0.05, -0.02, -0.16]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.07, 0.22, 0.05]} />
      </mesh>
    </group>
  );
}

/* ── Ana figür ──────────────────────────────────── */
function HajjFigure({ isScrolling }: { isScrolling: boolean }) {
  const root       = useRef<THREE.Group>(null);
  const torso      = useRef<THREE.Group>(null);
  const neck       = useRef<THREE.Group>(null);
  const leftThigh  = useRef<THREE.Group>(null);
  const rightThigh = useRef<THREE.Group>(null);
  const leftShin   = useRef<THREE.Group>(null);
  const rightShin  = useRef<THREE.Group>(null);
  const leftArm    = useRef<THREE.Group>(null);
  const rightArm   = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (isScrolling) {
      const s  = Math.sin(t * 9);
      const s2 = Math.sin(t * 18);
      if (root.current)        root.current.position.y       = -0.9 + Math.abs(s2) * 0.07;
      if (torso.current)       torso.current.rotation.x      = -0.22;
      if (torso.current)       torso.current.rotation.z      = s * 0.04;
      if (neck.current)        neck.current.rotation.x       = 0.1;
      if (leftThigh.current)   leftThigh.current.rotation.x  =  s * 0.9;
      if (rightThigh.current)  rightThigh.current.rotation.x = -s * 0.9;
      if (leftShin.current)    leftShin.current.rotation.x   = Math.max(0, -s) * 1.1;
      if (rightShin.current)   rightShin.current.rotation.x  = Math.max(0,  s) * 1.1;
      if (leftArm.current)     leftArm.current.rotation.x    = -s * 0.7;
      if (rightArm.current)    rightArm.current.rotation.x   =  s * 0.7;
    } else {
      const br = Math.sin(t * 1.3) * 0.018;
      if (root.current)        root.current.position.y       = -0.9 + br;
      if (torso.current)       torso.current.rotation.x      = THREE.MathUtils.lerp(torso.current.rotation.x, 0, 0.06);
      if (torso.current)       torso.current.rotation.z      = 0;
      if (neck.current)        neck.current.rotation.x       = 0;
      if (leftThigh.current)   leftThigh.current.rotation.x  = THREE.MathUtils.lerp(leftThigh.current.rotation.x,  0, 0.07);
      if (rightThigh.current)  rightThigh.current.rotation.x = THREE.MathUtils.lerp(rightThigh.current.rotation.x, 0, 0.07);
      if (leftShin.current)    leftShin.current.rotation.x   = THREE.MathUtils.lerp(leftShin.current.rotation.x,   0, 0.07);
      if (rightShin.current)   rightShin.current.rotation.x  = THREE.MathUtils.lerp(rightShin.current.rotation.x,  0, 0.07);
      if (leftArm.current)     leftArm.current.rotation.x    = THREE.MathUtils.lerp(leftArm.current.rotation.x,    0, 0.07);
      if (rightArm.current)    rightArm.current.rotation.x   = THREE.MathUtils.lerp(rightArm.current.rotation.x,   0, 0.07);
    }
  });

  return (
    <group ref={root} position={[0, -0.9, 0]}>
      <group ref={torso}>
        {/* Boyun */}
        <group ref={neck}>
          <mesh material={skin} position={[0, 1.34, 0]}>
            <cylinderGeometry args={[0.07, 0.075, 0.16, 12]} />
          </mesh>
          {/* Baş */}
          <mesh material={skin} position={[0, 1.52, 0]}>
            <sphereGeometry args={[0.18, 20, 20]} />
          </mesh>
          <mesh material={skin} position={[0, 1.57, 0.11]}>
            <sphereGeometry args={[0.13, 14, 14]} />
          </mesh>
          <mesh material={skin} position={[0, 1.40, 0.09]}>
            <sphereGeometry args={[0.095, 12, 12]} />
          </mesh>
          {/* Gözler */}
          <mesh material={eyeM} position={[0.072, 1.56, 0.162]}>
            <sphereGeometry args={[0.022, 10, 10]} />
          </mesh>
          <mesh material={eyeM} position={[-0.072, 1.56, 0.162]}>
            <sphereGeometry args={[0.022, 10, 10]} />
          </mesh>
          {/* Burun */}
          <mesh material={skinDark} position={[0, 1.49, 0.175]}>
            <sphereGeometry args={[0.028, 10, 10]} />
          </mesh>
          {/* Dudak */}
          <mesh material={lip} position={[0, 1.42, 0.170]}>
            <boxGeometry args={[0.07, 0.025, 0.02]} />
          </mesh>
          {/* Sakal */}
          <mesh material={beard} position={[0, 1.37, 0.11]}>
            <sphereGeometry args={[0.11, 14, 14]} />
          </mesh>
          <mesh material={beard} position={[0.06, 1.41, 0.09]}>
            <sphereGeometry args={[0.07, 10, 10]} />
          </mesh>
          <mesh material={beard} position={[-0.06, 1.41, 0.09]}>
            <sphereGeometry args={[0.07, 10, 10]} />
          </mesh>
          {/* Bıyık */}
          <mesh material={beard} position={[0, 1.45, 0.172]}>
            <boxGeometry args={[0.08, 0.022, 0.018]} />
          </mesh>
          {/* İHRAM SARIK */}
          <Turban position={[0, 1.56, 0]} />
        </group>

        {/* Omuzlar */}
        <mesh material={ihram} position={[0, 1.14, 0]}>
          <sphereGeometry args={[0.235, 16, 16]} />
        </mesh>
        {/* Gövde üst */}
        <mesh material={ihram} position={[0, 0.97, 0]}>
          <cylinderGeometry args={[0.215, 0.205, 0.44, 16]} />
        </mesh>
        {/* Göbek */}
        <mesh material={ihram} position={[0, 0.73, 0]}>
          <cylinderGeometry args={[0.20, 0.215, 0.28, 16]} />
        </mesh>
        {/* Kuşak */}
        <mesh material={ihramS} position={[0, 0.59, 0]}>
          <cylinderGeometry args={[0.218, 0.218, 0.06, 16]} />
        </mesh>
        {/* Etek */}
        <mesh material={ihram} position={[0, 0.51, 0]}>
          <cylinderGeometry args={[0.215, 0.265, 0.2, 16]} />
        </mesh>

        <Arm side={1}  armRef={leftArm}  />
        <Arm side={-1} armRef={rightArm} />
      </group>

      <Leg side={1}  thighRef={leftThigh}  shinRef={leftShin}  />
      <Leg side={-1} thighRef={rightThigh} shinRef={rightShin} />
    </group>
  );
}

/* ── Canvas ─────────────────────────────────────── */
function HajjScene({ isScrolling }: { isScrolling: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 2.6], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={1}
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[2, 5, 3]} intensity={2.0} />
      <directionalLight position={[-2, 2, -1]} intensity={0.5} color="#f0e8d8" />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#fff8f0" />
      <HajjFigure isScrolling={isScrolling} />
    </Canvas>
  );
}

/* ── Export ─────────────────────────────────────── */
export default function HajjMan() {
  const { isScrolling, pastHero } = useScrollState();

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.div
          className="fixed left-0 bottom-0 z-20 pointer-events-none hidden sm:block"
          style={{ width: "clamp(130px, 13vw, 200px)", height: "clamp(280px, 28vw, 420px)" }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <HajjScene isScrolling={isScrolling} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
