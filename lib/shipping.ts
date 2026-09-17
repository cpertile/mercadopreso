import type { ShippingOption } from "./types";

export const shippingOptions: ShippingOption[] = [
  {
    id: "preso-envios",
    name: "Preso Envios",
    eta: "3 a 5 dias (mentira)",
    price: 0,
  },
  {
    id: "fuga-express",
    name: "Fuga Express",
    eta: "Chega nunca, mas sai rápido",
    price: 19.9,
  },
  {
    id: "visitacao",
    name: "Dia de Visitação",
    eta: "Domingo, se o diretor deixar",
    price: 8.5,
  },
];
