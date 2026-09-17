import { ProductGrid } from "@/components/product-card";
import { searchCatalog } from "@/lib/catalog";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  searchParams: Promise<{ q?: string; sort?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", sort: sortParam } = await searchParams;
  const sort =
    sortParam === "price_asc" || sortParam === "price_desc" ? sortParam : "relevance";
  const result = await searchCatalog({ q, sort });
  const query = new URLSearchParams();
  if (q) query.set("q", q);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {q ? `Resultados para “${q}”` : "Buscar no pátio"}
          </h1>
          <p className="text-sm text-[#666]">
            {result.total} anúncio{result.total === 1 ? "" : "s"}
            {result.source === "mixed" ? " · incluindo Mercado Livre" : ""}
            {result.source === "local" && q ? " · catálogo local (API do ML indisponível)" : ""}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <SortLink href={`/busca?${query.toString()}`} active={sort === "relevance"}>
            Relevância
          </SortLink>
          <SortLink
            href={`/busca?${new URLSearchParams({ ...Object.fromEntries(query), sort: "price_asc" })}`}
            active={sort === "price_asc"}
          >
            Menor preço
          </SortLink>
          <SortLink
            href={`/busca?${new URLSearchParams({ ...Object.fromEntries(query), sort: "price_desc" })}`}
            active={sort === "price_desc"}
          >
            Maior preço
          </SortLink>
        </div>
      </div>
      <ProductGrid products={result.results} />
    </div>
  );
}

function SortLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 ${
        active ? "bg-[#333] text-white" : "bg-white text-[#666]"
      }`}
    >
      {children}
    </Link>
  );
}
