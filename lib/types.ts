export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export type Seller = {
  name: string;
  rating: number;
  sales: number;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  seller: Seller;
  description: string;
  condition: "novo" | "usado";
  shippingLabel: string;
  freeShipping: boolean;
  stock: number;
  attributes: { name: string; value: string }[];
  source: "local" | "mercadolivre";
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Address = {
  name: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type ShippingOption = {
  id: string;
  name: string;
  eta: string;
  price: number;
};

export type PaymentMethod = "card" | "pix" | "boleto";

export type Payment = {
  method: PaymentMethod;
  last4?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  address: Address;
  shipping: ShippingOption;
  payment: Payment;
  subtotal: number;
  shippingPrice: number;
  total: number;
  createdAt: string;
  status: string;
};

export type SearchParams = {
  q?: string;
  category?: string;
  sort?: "relevance" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
};

export type SearchResult = {
  results: Product[];
  total: number;
  source: "local" | "mercadolivre" | "mixed";
  ml?: "unavailable" | "empty" | "ok";
};
