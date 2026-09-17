import { ProductGrid } from "@/components/product-card";
import { getCategory, searchLocal } from "@/lib/catalog";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const { results, total } = searchLocal({ category: slug });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-[#666]">Categoria</p>
        <h1 className="text-xl font-semibold">
          {category.icon} {category.name}
        </h1>
        <p className="text-sm text-[#666]">{total} anúncios</p>
      </div>
      <ProductGrid products={results} />
    </div>
  );
}
