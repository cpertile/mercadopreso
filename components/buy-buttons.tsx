"use client";

import { useShop } from "@/lib/store";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BuyButtons({
  product,
  layout = "stack",
}: {
  product: Product;
  layout?: "stack" | "row";
}) {
  const addToCart = useShop((state) => state.addToCart);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function add() {
    addToCart(product, 1);
    setAdded(true);
  }

  function buyNow() {
    addToCart(product, 1);
    router.push("/checkout");
  }

  const stacked = layout === "stack";

  return (
    <div className={stacked ? "space-y-2" : "grid grid-cols-2 gap-2"}>
      <button
        type="button"
        onClick={buyNow}
        className={`rounded-md bg-[#3483fa] py-3 text-sm font-semibold text-white hover:bg-[#2968c8] ${stacked ? "w-full" : ""}`}
      >
        Comprar agora
      </button>
      <button
        type="button"
        onClick={add}
        className={`rounded-md bg-[#3483fa]/15 py-3 text-sm font-semibold text-[#3483fa] hover:bg-[#3483fa]/25 ${stacked ? "w-full" : ""}`}
      >
        {added ? "Adicionado" : stacked ? "Adicionar ao carrinho" : "Carrinho"}
      </button>
    </div>
  );
}
