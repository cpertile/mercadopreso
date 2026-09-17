import { BuyButtons } from "@/components/buy-buttons";
import { ProductGallery } from "@/components/product-gallery";
import { getProduct } from "@/lib/catalog";
import { discountPercent, formatBRL } from "@/lib/format";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <div className="grid gap-4 pb-28 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:pb-0">
      <section className="rounded-md bg-white p-4 md:p-6">
        <ProductGallery product={product} />
        <h1 className="mt-4 text-xl font-semibold md:hidden">{product.title}</h1>
        <div className="mt-6 border-t border-black/10 pt-4">
          <h2 className="mb-2 font-semibold">Descrição</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#555]">
            {product.description}
          </p>
        </div>
        {product.attributes.length ? (
          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {product.attributes.map((attribute) => (
              <div key={attribute.name} className="rounded bg-[#f5f5f5] px-3 py-2">
                <dt className="text-xs text-[#999]">{attribute.name}</dt>
                <dd>{attribute.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      <aside className="space-y-3">
        <div className="rounded-md bg-white p-4 md:p-5">
          <p className="text-xs uppercase text-[#999]">
            {product.condition === "novo" ? "Novo" : "Usado"} · {product.stock} no pátio
          </p>
          <h1 className="mt-1 hidden text-xl font-semibold md:block">{product.title}</h1>
          <div className="mt-3">
            {product.originalPrice ? (
              <p className="text-sm text-[#999] line-through">{formatBRL(product.originalPrice)}</p>
            ) : null}
            <p className="text-3xl font-light">
              {formatBRL(product.price)}
              {discount ? (
                <span className="ml-2 text-base font-semibold text-[#00a650]">{discount}% OFF</span>
              ) : null}
            </p>
          </div>
          <p className={`mt-2 text-sm font-semibold ${product.freeShipping ? "text-[#00a650]" : "text-[#666]"}`}>
            {product.shippingLabel}
          </p>
          <p className="mt-3 text-sm text-[#666]">
            Vendido por <strong>{product.seller.name}</strong> · {product.seller.rating} ★ ·{" "}
            {product.seller.sales.toLocaleString("pt-BR")} vendas
          </p>
          <div className="mt-4 hidden md:block">
            <BuyButtons product={product} />
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-black/10 bg-white p-3 md:hidden">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-lg font-semibold">{formatBRL(product.price)}</span>
          <span className="text-xs text-[#00a650]">{product.shippingLabel}</span>
        </div>
        <BuyButtons product={product} layout="row" />
      </div>
    </div>
  );
}
