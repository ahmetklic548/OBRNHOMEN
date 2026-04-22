"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function StackedImages({ images, name }: Props) {
  if (images.length === 0) {
    return (
      <div
        className="aspect-[4/5] flex items-center justify-center rounded-2xl"
        style={{ background: "#F5F5F7" }}
      >
        <p className="text-xs tracking-widest uppercase" style={{ color: "#86868B" }}>
          Görsel Yok
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {images.map((src, i) => (
        <motion.div
          key={src}
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: i === 0 ? "4/5" : "1/1",
            borderRadius: 16,
            background: "#F5F5F7",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: i === 0 ? 0 : 0.05 }}
        >
          <Image
            src={src}
            alt={`${name} — görsel ${i + 1}`}
            fill
            priority={i === 0}
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </motion.div>
      ))}
    </div>
  );
}
