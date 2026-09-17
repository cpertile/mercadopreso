"use client";

import { formatBRL } from "@/lib/format";
import { useShopHydrated } from "@/lib/hydration";
import { useCartSubtotal, useShop } from "@/lib/store";
import Link from "next/link";

export default function CartPage() {
  const cart = useShop((state) => state.cart);
  const setQuantity = useShop((state) => state.setQuantity);
  const removeFromCart = useShop((state) => state.removeFromCart);
  const subtotal = useCartSubtotal();
  const ready = useShopHydrated();

  if (!ready) {
    return <p className="text-sm text-[#666]">Abrindo o carrinho...</p>;
  }

  if (!cart.length) {
    return (
      <div className="rounded-md bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Carrinho vazio</h1>
        <p className="mt-2 text-sm text-[#666]">Nada preso aqui ainda.</p>
        <Link href="/" className="mt-4 inline-block rounded-md bg-[#3483fa] px-4 py-2 text-sm font-semibold text-white">
          Continuar simulando
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
      <section className="space-y-3">
        <h1 className="text-xl font-semibold">Carrinho</h1>
        {cart.map((item) => (
          <article key={item.product.id} className="flex gap-3 rounded-md bg-white p-3">
            <img
              src={item.product.images[0]}
              alt=""
              className="h-20 w-20 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link href={`/produto/${item.product.id}`} className="line-clamp-2 text-sm hover:underline">
                {item.product.title}
              </Link>
              <p className="mt-1 font-semibold">{formatBRL(item.product.price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="h-7 w-7 rounded border"
                  onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  className="h-7 w-7 rounded border"
                  onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-auto text-xs text-[#3483fa]"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <aside className="h-fit rounded-md bg-white p-4">
        <h2 className="font-semibold">Resumo</h2>
        <p className="mt-3 flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </p>
        <p className="mt-1 text-xs text-[#00a650]">Frete calculado no checkout (também fake).</p>
        <Link
          href="/checkout"
          className="mt-4 block rounded-md bg-[#3483fa] py-3 text-center text-sm font-semibold text-white"
        >
          Continuar a compra
        </Link>
      </aside>
    </div>
  );
}
