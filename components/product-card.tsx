import { discountPercent, formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Link
      href={`/produto/${product.id}`}
      className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-[#f5f5f5]">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        {product.source === "mercadolivre" ? (
          <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#3483fa]">
            ML
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-lg font-light leading-none text-[#333]">{formatBRL(product.price)}</p>
        {product.originalPrice ? (
          <p className="text-xs text-[#00a650]">
            <span className="mr-1 text-[#999] line-through">{formatBRL(product.originalPrice)}</span>
            {discount}% OFF
          </p>
        ) : null}
        {product.freeShipping ? (
          <p className="text-xs font-semibold text-[#00a650]">{product.shippingLabel}</p>
        ) : (
          <p className="text-xs text-[#999]">{product.shippingLabel}</p>
        )}
        <p className="mt-1 line-clamp-2 text-sm text-[#666]">{product.title}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <p className="rounded-md bg-white p-8 text-center text-sm text-[#666]">
        Nada encontrado no pátio. Tenta outra busca.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
