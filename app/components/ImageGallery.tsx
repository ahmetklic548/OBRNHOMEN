"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-stone-100 flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
        Görsel Yok
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Ana görsel */}
      <div className="aspect-square bg-stone-100 relative overflow-hidden">
        <Image
          key={selected}
          src={images[selected]}
          alt={name}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selected === 0}
        />
        {/* Görsel sayacı */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 tracking-widest">
            {selected + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnail şeridi */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`aspect-square relative overflow-hidden transition-all ${
                selected === i
                  ? "ring-2 ring-stone-800 ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
