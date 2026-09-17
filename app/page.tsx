import { categories, featuredProducts, searchLocal } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-card";
import Link from "next/link";

export default function Home() {
  const offers = featuredProducts().slice(0, 8);
  const { results } = searchLocal({ limit: 16 });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-md bg-white p-4 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#3483fa]">
          PresoPago · Compra presa
        </p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">MercadoPreso</h1>
        <p className="mt-2 max-w-xl text-sm text-[#666]">
          A loja online de onde nada sai. Escolhe, coloca no carrinho, paga com PresoPago e
          acompanha o pedido preso no pátio. Dinheiro de mentira, produtos de mentira, diversão
          de verdade.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categorias</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:overflow-visible">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="flex min-w-[104px] flex-col items-center gap-2 rounded-md bg-white px-3 py-4 text-center shadow-sm"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Ofertas do pátio</h2>
        <ProductGrid products={offers} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Mais produtos</h2>
        <ProductGrid products={results} />
      </section>
    </div>
  );
}
