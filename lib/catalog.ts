import catalog from "@/data/catalog.json";
import { tryMlItem, tryMlSearch } from "./ml";
import type { Category, Product, SearchParams, SearchResult } from "./types";

const localProducts: Product[] = catalog.products.map((product) => ({
  ...product,
  condition: product.condition as Product["condition"],
  source: "local",
}));

export const categories: Category[] = catalog.categories;

function matchesQuery(product: Product, q?: string) {
  if (!q?.trim()) return true;
  const hay = `${product.title} ${product.description} ${product.seller.name}`.toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}

function sortProducts(products: Product[], sort?: SearchParams["sort"]) {
  const copy = [...products];
  if (sort === "price_asc") copy.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") copy.sort((a, b) => b.price - a.price);
  return copy;
}

export function getLocalProduct(id: string) {
  return localProducts.find((product) => product.id === id) ?? null;
}

export function searchLocal(params: SearchParams): SearchResult {
  const filtered = localProducts.filter((product) => {
    const byCategory = params.category ? product.category === params.category : true;
    return byCategory && matchesQuery(product, params.q);
  });
  const sorted = sortProducts(filtered, params.sort);
  const offset = params.offset ?? 0;
  const limit = params.limit ?? 48;
  return {
    results: sorted.slice(offset, offset + limit),
    total: sorted.length,
    source: "local",
  };
}

export function featuredProducts() {
  return localProducts.filter((product) => product.originalPrice);
}

export function productsByCategory(slug: string) {
  return localProducts.filter((product) => product.category === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function searchCatalog(params: SearchParams): Promise<SearchResult> {
  const local = searchLocal(params);
  if (!params.q?.trim() || params.category) return local;

  const remote = await tryMlSearch(params.q);
  if (!remote?.length) return local;

  const merged = [
    ...remote,
    ...local.results.filter((product) => !remote.some((item) => item.id === product.id)),
  ];
  const sorted = sortProducts(merged, params.sort);
  const offset = params.offset ?? 0;
  const limit = params.limit ?? 48;
  return {
    results: sorted.slice(offset, offset + limit),
    total: sorted.length,
    source: "mixed",
  };
}

export async function getProduct(id: string) {
  return getLocalProduct(id) ?? (await tryMlItem(id));
}
