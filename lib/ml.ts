import type { Product } from "./types";

type MlSearchItem = {
  id?: string;
  title?: string;
  price?: number;
  original_price?: number | null;
  thumbnail?: string;
  pictures?: { url?: string; secure_url?: string }[];
  seller?: { nickname?: string };
  permalink?: string;
  condition?: string;
  shipping?: { free_shipping?: boolean };
  available_quantity?: number;
  category_id?: string;
};

function mlHeaders() {
  const headers: HeadersInit = { Accept: "application/json" };
  const token = process.env.ML_ACCESS_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function mapMlItem(item: MlSearchItem): Product {
  const images = [
    ...(item.pictures ?? [])
      .map((p) => p.secure_url || p.url)
      .filter((url): url is string => Boolean(url)),
    item.thumbnail,
  ].filter((url): url is string => Boolean(url));

  return {
    id: String(item.id ?? ""),
    title: item.title || "Anúncio Mercado Livre",
    price: Number(item.price ?? 0),
    originalPrice: item.original_price ?? undefined,
    category: "eletronicos",
    images: images.length ? images : ["https://picsum.photos/seed/ml-fallback/800/800"],
    seller: {
      name: item.seller?.nickname || "Vendedor ML",
      rating: 4.5,
      sales: 0,
    },
    description:
      "Anúncio obtido da API do Mercado Livre para simulação. Nada será cobrado nem enviado. Os produtos desta loja não existem de verdade.",
    condition: item.condition === "used" ? "usado" : "novo",
    shippingLabel: item.shipping?.free_shipping ? "Frete Preso" : "Preso Envios",
    freeShipping: Boolean(item.shipping?.free_shipping),
    stock: Number(item.available_quantity ?? 1) || 1,
    attributes: item.category_id
      ? [{ name: "Categoria ML", value: item.category_id }]
      : [],
    source: "mercadolivre",
  };
}

async function mlFetch(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(url, {
      headers: mlHeaders(),
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function tryMlSearch(q: string): Promise<Product[] | null> {
  if (!q.trim()) return null;
  const data = await mlFetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=20`,
  );
  const results = data?.results;
  if (!Array.isArray(results)) return null;
  return results.map(mapMlItem);
}

export async function tryMlItem(id: string): Promise<Product | null> {
  if (!id.startsWith("MLB") && !id.startsWith("MLA")) return null;
  const data = await mlFetch(`https://api.mercadolibre.com/items/${encodeURIComponent(id)}`);
  if (!data?.id) return null;
  const product = mapMlItem(data);
  const descriptionData = await mlFetch(
    `https://api.mercadolibre.com/items/${encodeURIComponent(id)}/description`,
  );
  const plain = descriptionData?.plain_text;
  if (typeof plain === "string" && plain.trim()) {
    product.description = `${plain.trim()}\n\nSimulação MercadoPreso — nada será cobrado nem enviado.`;
  }
  return product;
}
