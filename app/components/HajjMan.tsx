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
const eye     = new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.5,  metalness: 0 });
const lip     = new THREE.MeshStandardMaterial({ color: "#8b5e52", roughness: 0.7,  metalness: 0 });

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

/* ── Tek bacak bileşeni ─────────────────────────── */
function Leg({
  side,
  thighRef,
  shinRef,
}: {
  side: 1 | -1;
  thighRef: React.RefObject<THREE.Group | null>;
  shinRef:  React.RefObject<THREE.Group | null>;
}) {
  const x = side * 0.12;
  return (
    <group ref={thighRef} position={[x, 0.42, 0]}>
      {/* Uyluk — ihram */}
      <mesh material={ihram} position={[0, -0.19, 0]}>
        <cylinderGeometry args={[0.095, 0.082, 0.4, 14]} />
      </mesh>
      {/* Diz kemiği */}
      <mesh material={skinDark} position={[0, -0.41, 0]}>
        <sphereGeometry args={[0.072, 12, 12]} />
      </mesh>
      {/* Alt bacak */}
      <group ref={shinRef} position={[0, -0.41, 0]}>
        <mesh material={skin} position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.068, 0.052, 0.38, 14]} />
        </mesh>
        {/* Ayak bileği */}
        <mesh material={skin} position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
        {/* Ayak */}
        <mesh material={skinDark} position={[side * 0.01, -0.44, 0.07]}>
          <boxGeometry args={[0.1, 0.055, 0.2]} />
        </mesh>
        {/* Parmak ucu yuvarlağı */}
        <mesh material={skinDark} position={[side * 0.01, -0.455, 0.16]}>
          <sphereGeometry args={[0.042, 10, 10]} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Tek kol bileşeni ───────────────────────────── */
function Arm({
  side,
  armRef,
}: {
  side: 1 | -1;
  armRef: React.RefObject<THREE.Group | null>;
}) {
  const x = side * 0.27;
  return (
    <group ref={armRef} position={[x, 1.16, 0]}>
      {/* Omuz yuvarlağı */}
      <mesh material={ihram} position={[0, 0, 0]}>
        <sphereGeometry args={[0.085, 12, 12]} />
      </mesh>
      {/* Üst kol */}
      <mesh material={ihram} position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.068, 0.058, 0.32, 12]} />
      </mesh>
      {/* Dirsek */}
      <mesh material={skin} position={[0, -0.34, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
      </mesh>
      {/* Ön kol */}
      <mesh material={skin} position={[0, -0.50, 0]}>
        <cylinderGeometry args={[0.052, 0.042, 0.28, 12]} />
      </mesh>
      {/* El */}
      <mesh material={skinDark} position={[0, -0.66, 0.02]}>
        <boxGeometry args={[0.075, 0.1, 0.055]} />
      </mesh>
    </group>
  );
}

/* ── Hac figürü ─────────────────────────────────── */
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
      if (torso.current)       torso.current.rotation.x      = -0.2;
      if (torso.current)       torso.current.rotation.z      = Math.sin(t * 9) * 0.04;
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

        {/* ── Boyun ── */}
        <group ref={neck}>
          <mesh material={skin} position={[0, 1.34, 0]}>
            <cylinderGeometry args={[0.07, 0.075, 0.16, 12]} />
          </mesh>

          {/* ── Baş ── */}
          <mesh material={skin} position={[0, 1.54, 0]}>
            <sphereGeometry args={[0.185, 20, 20]} />
          </mesh>
          {/* Alın hafif çıkıntı */}
          <mesh material={skin} position={[0, 1.60, 0.12]}>
            <sphereGeometry args={[0.14, 14, 14]} />
          </mesh>
          {/* Çene */}
          <mesh material={skin} position={[0, 1.42, 0.1]}>
            <sphereGeometry args={[0.1, 12, 12]} />
          </mesh>
          {/* Sol göz */}
          <mesh material={eye} position={[0.072, 1.58, 0.165]}>
            <sphereGeometry args={[0.022, 10, 10]} />
          </mesh>
          {/* Sağ göz */}
          <mesh material={eye} position={[-0.072, 1.58, 0.165]}>
            <sphereGeometry args={[0.022, 10, 10]} />
          </mesh>
          {/* Burun */}
          <mesh material={skinDark} position={[0, 1.51, 0.178]}>
            <sphereGeometry args={[0.028, 10, 10]} />
          </mesh>
          {/* Dudak */}
          <mesh material={lip} position={[0, 1.44, 0.172]}>
            <boxGeometry args={[0.07, 0.025, 0.02]} />
          </mesh>
          {/* Sakal */}
          <mesh material={beard} position={[0, 1.40, 0.12]}>
            <sphereGeometry args={[0.11, 14, 14]} />
          </mesh>
          <mesh material={beard} position={[0.06, 1.44, 0.1]}>
            <sphereGeometry args={[0.07, 10, 10]} />
          </mesh>
          <mesh material={beard} position={[-0.06, 1.44, 0.1]}>
            <sphereGeometry args={[0.07, 10, 10]} />
          </mesh>
          {/* Bıyık */}
          <mesh material={beard} position={[0, 1.47, 0.175]}>
            <boxGeometry args={[0.08, 0.022, 0.018]} />
          </mesh>
        </group>

        {/* ── Omuz kemerleri (ihram üst) ── */}
        <mesh material={ihram} position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
        </mesh>

        {/* ── Gövde üst ── */}
        <mesh material={ihram} position={[0, 0.98, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.44, 16]} />
        </mesh>

        {/* ── Göbek bölgesi ── */}
        <mesh material={ihram} position={[0, 0.74, 0]}>
          <cylinderGeometry args={[0.20, 0.22, 0.28, 16]} />
        </mesh>

        {/* ── İhram beli (kuşak detayı) ── */}
        <mesh material={ihramS} position={[0, 0.60, 0]}>
          <cylinderGeometry args={[0.215, 0.215, 0.06, 16]} />
        </mesh>

        {/* ── İhram etek ── */}
        <mesh material={ihram} position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.21, 0.26, 0.2, 16]} />
        </mesh>

        {/* ── Kollar ── */}
        <Arm side={1}  armRef={leftArm}  />
        <Arm side={-1} armRef={rightArm} />
      </group>

      {/* ── Bacaklar ── */}
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
      <directionalLight position={[2, 5, 3]} intensity={2.0} castShadow />
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
          className="fixed left-0 bottom-0 z-20 w-36 h-80 md:w-52 md:h-[28rem] pointer-events-none"
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
