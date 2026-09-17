"use client";

import { useShopHydrated } from "@/lib/hydration";
import { useCartCount } from "@/lib/store";
import Link from "next/link";

export function CartBadge({ className = "" }: { className?: string }) {
  const count = useCartCount();
  const ready = useShopHydrated();
  const shown = ready ? count : 0;

  return (
    <Link href="/carrinho" className={`relative flex items-center gap-1 ${className}`} aria-label="Carrinho">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6L5 3H2" />
        <circle cx="9" cy="20" r="1.3" fill="currentColor" />
        <circle cx="18" cy="20" r="1.3" fill="currentColor" />
      </svg>
      {shown > 0 ? (
        <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3483fa] px-1 text-[10px] font-bold text-white">
          {shown}
        </span>
      ) : null}
    </Link>
  );
}
