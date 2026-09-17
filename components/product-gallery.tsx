"use client";

import type { Product } from "@/lib/types";
import { useState } from "react";

export function ProductGallery({ product }: { product: Product }) {
  const [current, setCurrent] = useState(0);
  const image = product.images[current] ?? product.images[0];

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-md bg-white">
        <img src={image} alt={product.title} className="h-full w-full object-cover" />
      </div>
      {product.images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrent(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded border ${
                index === current ? "border-[#3483fa]" : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
