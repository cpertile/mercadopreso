"use client";

import { formatBRL, formatDate } from "@/lib/format";
import { useShopHydrated } from "@/lib/hydration";
import { useShop } from "@/lib/store";
import Link from "next/link";

export default function OrdersPage() {
  const orders = useShop((state) => state.orders);
  const ready = useShopHydrated();

  if (!ready) return <p className="text-sm text-[#666]">Abrindo histórico...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Meus pedidos</h1>
      {!orders.length ? (
        <div className="rounded-md bg-white p-8 text-center">
          <p className="text-sm text-[#666]">Você ainda não foi preso em compra nenhuma.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-[#3483fa]">
            Ir às compras
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/pedido/${order.id}`} className="block rounded-md bg-white p-4 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-xs text-[#666]">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-[#fff8c2] px-2 py-0.5 text-xs">{order.status}</span>
                </div>
                <p className="mt-2 text-sm">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"} · {formatBRL(order.total)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
