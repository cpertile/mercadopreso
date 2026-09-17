"use client";

import { formatBRL, formatDate } from "@/lib/format";
import { useShopHydrated } from "@/lib/hydration";
import { useShop } from "@/lib/store";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const orders = useShop((state) => state.orders);
  const ready = useShopHydrated();

  if (!ready) return <p className="text-sm text-[#666]">Buscando pedido...</p>;

  const order = orders.find((item) => item.id === params.id);
  if (!order) {
    return (
      <div className="rounded-md bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">Pedido não encontrado</h1>
        <p className="mt-2 text-sm text-[#666]">Ele pode ter fugido do localStorage.</p>
        <Link href="/meus-pedidos" className="mt-4 inline-block text-sm text-[#3483fa]">
          Ver meus pedidos
        </Link>
      </div>
    );
  }

  const methodLabel =
    order.payment.method === "pix"
      ? "PIX"
      : order.payment.method === "boleto"
        ? "Boleto"
        : `Cartão •••• ${order.payment.last4 ?? "0000"}`;

  return (
    <div className="space-y-4">
      <section className="rounded-md bg-white p-5">
        <p className="text-sm text-[#00a650] font-semibold">Pagamento simulado aprovado</p>
        <h1 className="mt-1 text-2xl font-bold">Pedido {order.id}</h1>
        <p className="mt-1 text-sm text-[#666]">{formatDate(order.createdAt)}</p>
        <p className="mt-3 rounded-md bg-[#fff8c2] px-3 py-2 text-sm">
          Status: <strong>{order.status}</strong>. Nada foi cobrado e nada será enviado.
        </p>
      </section>

      <section className="rounded-md bg-white p-5 text-sm">
        <h2 className="font-semibold">Itens</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item) => (
            <li key={item.product.id} className="flex justify-between gap-3">
              <span>
                {item.quantity}× {item.product.title}
              </span>
              <span>{formatBRL(item.product.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between">
          <span>Frete · {order.shipping.name}</span>
          <span>{order.shippingPrice === 0 ? "Grátis" : formatBRL(order.shippingPrice)}</span>
        </p>
        <p className="mt-2 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatBRL(order.total)}</span>
        </p>
      </section>

      <section className="rounded-md bg-white p-5 text-sm">
        <h2 className="font-semibold">Entrega (fictícia)</h2>
        <p className="mt-2">
          {order.address.name}
          <br />
          {order.address.street}, {order.address.number}
          {order.address.complement ? ` — ${order.address.complement}` : ""}
          <br />
          {order.address.neighborhood} · {order.address.city}/{order.address.state}
          <br />
          CEP {order.address.cep}
        </p>
        <p className="mt-3 text-[#666]">
          {order.shipping.eta} · pago com {methodLabel}
        </p>
      </section>

      <Link href="/" className="inline-block text-sm text-[#3483fa]">
        Voltar ao pátio
      </Link>
    </div>
  );
}
