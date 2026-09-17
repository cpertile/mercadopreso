import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, CartItem, Order, Payment, Product, ShippingOption } from "./types";

type ShopState = {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (input: {
    address: Address;
    shipping: ShippingOption;
    payment: Payment;
  }) => Order;
};

function cartSubtotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity }] };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      placeOrder: ({ address, shipping, payment }) => {
        const { cart } = get();
        const subtotal = cartSubtotal(cart);
        const order: Order = {
          id: `MP-${Date.now().toString(36).toUpperCase()}`,
          items: cart,
          address,
          shipping,
          payment,
          subtotal,
          shippingPrice: shipping.price,
          total: subtotal + shipping.price,
          createdAt: new Date().toISOString(),
          status: "preso no pátio",
        };
        set((state) => ({
          orders: [order, ...state.orders],
          cart: [],
        }));
        return order;
      },
    }),
    { name: "mercadopreso-shop" },
  ),
);

export function useCartCount() {
  return useShop((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
}

export function useCartSubtotal() {
  return useShop((state) => cartSubtotal(state.cart));
}
