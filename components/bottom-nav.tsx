"use client";

import { useShopHydrated } from "@/lib/hydration";
import { useCartCount } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Início", icon: HomeIcon },
  { href: "/busca", label: "Busca", icon: SearchIcon },
  { href: "/carrinho", label: "Carrinho", icon: CartIcon },
  { href: "/meus-pedidos", label: "Pedidos", icon: OrdersIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const count = useCartCount();
  const ready = useShopHydrated();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white md:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] ${
                  active ? "text-[#3483fa]" : "text-[#666]"
                }`}
              >
                <Icon />
                {item.href === "/carrinho" && ready && count > 0 ? (
                  <span className="absolute right-[22%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3483fa] px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                ) : null}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5L12 4l8 6.5V20H4z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H2" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 9h8M8 13h6" />
    </svg>
  );
}
