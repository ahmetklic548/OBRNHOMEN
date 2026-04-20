"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

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
      timer.current = setTimeout(() => setIsScrolling(false), 200);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => { window.removeEventListener("scroll", h); };
  }, []);

  return { isScrolling, pastHero };
}

/* ── GLB Model ──────────────────────────────────── */
function HajjModel({ isScrolling }: { isScrolling: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/hajj.glb");
  const { actions, names } = useAnimations(animations, groupRef);

  /* İlk animasyonu scroll'a göre kontrol et */
  useEffect(() => {
    if (!names.length) return;
    const action = actions[names[0]];
    if (!action) return;
    action.reset().play();
    action.paused = !isScrolling;
  }, [isScrolling, actions, names]);

  /* Durduğunda yavaş nefes hareketi */
  useFrame(({ clock }) => {
    if (!groupRef.current || isScrolling) return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.012;
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <primitive object={scene} scale={1.0} />
    </group>
  );
}

useGLTF.preload("/hajj.glb");

/* ── Sahne ──────────────────────────────────────── */
function HajjScene({ isScrolling }: { isScrolling: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 3.2], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      dpr={0.75}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 5, 3]} intensity={2.5} />
      <directionalLight position={[-1, 2, -1]} intensity={0.6} color="#f0e8d8" />
      <Suspense fallback={null}>
        <HajjModel isScrolling={isScrolling} />
      </Suspense>
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
          style={{ width: "clamp(130px, 12vw, 190px)", height: "clamp(280px, 26vw, 400px)" }}
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
