"use client";

import { formatBRL } from "@/lib/format";
import { useShopHydrated } from "@/lib/hydration";
import { shippingOptions } from "@/lib/shipping";
import { useCartSubtotal, useShop } from "@/lib/store";
import type { Address, PaymentMethod, ShippingOption } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const emptyAddress: Address = {
  name: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export default function CheckoutPage() {
  const cart = useShop((state) => state.cart);
  const placeOrder = useShop((state) => state.placeOrder);
  const subtotal = useCartSubtotal();
  const router = useRouter();
  const ready = useShopHydrated();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(emptyAddress);
  const [cepStatus, setCepStatus] = useState("");
  const [shipping, setShipping] = useState<ShippingOption>(shippingOptions[0]);
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (ready && cart.length === 0) router.replace("/carrinho");
  }, [ready, cart.length, router]);

  async function lookupCep() {
    const cep = address.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      setCepStatus("CEP precisa ter 8 dígitos.");
      return;
    }
    setCepStatus("Consultando ViaCEP...");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepStatus("CEP não encontrado. Pode preencher na mão — também é fake.");
        return;
      }
      setAddress((current) => ({
        ...current,
        street: data.logradouro || current.street,
        neighborhood: data.bairro || current.neighborhood,
        city: data.localidade || current.city,
        state: data.uf || current.state,
      }));
      setCepStatus("Endereço preenchido. Nada será enviado para lá.");
    } catch {
      setCepStatus("ViaCEP falhou. Preenche na mão.");
    }
  }

  function update<K extends keyof Address>(key: K, value: Address[K]) {
    setAddress((current) => ({ ...current, [key]: value }));
  }

  function addressValid() {
    return (
      address.name.trim() &&
      address.cep.replace(/\D/g, "").length === 8 &&
      address.street.trim() &&
      address.number.trim() &&
      address.city.trim() &&
      address.state.trim()
    );
  }

  async function onPay(event: FormEvent) {
    event.preventDefault();
    setPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const last4 = cardNumber.replace(/\D/g, "").slice(-4);
    const order = placeOrder({
      address,
      shipping,
      payment: {
        method,
        last4: method === "card" ? last4 || "0000" : undefined,
      },
    });
    router.push(`/pedido/${order.id}`);
  }

  if (!ready) return <p className="text-sm text-[#666]">Preparando checkout...</p>;
  if (!cart.length) return null;

  const total = subtotal + shipping.price;

  return (
    <form onSubmit={onPay} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Checkout simulado</h1>
        <ol className="flex gap-2 text-xs">
          {["Endereço", "Frete", "PresoPago"].map((label, index) => (
            <li
              key={label}
              className={`rounded-full px-3 py-1 ${
                step === index + 1 ? "bg-[#333] text-white" : "bg-white text-[#666]"
              }`}
            >
              {index + 1}. {label}
            </li>
          ))}
        </ol>

        {step === 1 ? (
          <section className="space-y-3 rounded-md bg-white p-4">
            <Field label="Nome completo" value={address.name} onChange={(v) => update("name", v)} />
            <div className="flex gap-2">
              <Field
                label="CEP"
                value={address.cep}
                onChange={(v) => update("cep", v)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={lookupCep}
                className="mt-5 rounded-md bg-[#3483fa] px-3 text-sm font-semibold text-white"
              >
                Buscar
              </button>
            </div>
            {cepStatus ? <p className="text-xs text-[#666]">{cepStatus}</p> : null}
            <Field label="Rua" value={address.street} onChange={(v) => update("street", v)} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Número" value={address.number} onChange={(v) => update("number", v)} />
              <Field
                label="Complemento"
                value={address.complement}
                onChange={(v) => update("complement", v)}
              />
            </div>
            <Field
              label="Bairro"
              value={address.neighborhood}
              onChange={(v) => update("neighborhood", v)}
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Field label="Cidade" value={address.city} onChange={(v) => update("city", v)} />
              </div>
              <Field label="UF" value={address.state} onChange={(v) => update("state", v)} />
            </div>
            <button
              type="button"
              disabled={!addressValid()}
              onClick={() => setStep(2)}
              className="w-full rounded-md bg-[#3483fa] py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Ir para o frete
            </button>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-3 rounded-md bg-white p-4">
            {shippingOptions.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${
                  shipping.id === option.id ? "border-[#3483fa]" : "border-black/10"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping.id === option.id}
                  onChange={() => setShipping(option)}
                />
                <span className="flex-1">
                  <span className="block font-semibold">{option.name}</span>
                  <span className="text-xs text-[#666]">{option.eta}</span>
                </span>
                <span className="text-sm font-semibold">
                  {option.price === 0 ? "Grátis" : formatBRL(option.price)}
                </span>
              </label>
            ))}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-md bg-[#eee] py-3 text-sm">
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-md bg-[#3483fa] py-3 text-sm font-semibold text-white"
              >
                Ir para o pagamento
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-3 rounded-md bg-white p-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              {(["pix", "card", "boleto"] as PaymentMethod[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMethod(item)}
                  className={`rounded-md border py-2 ${
                    method === item ? "border-[#3483fa] font-semibold" : "border-black/10"
                  }`}
                >
                  {item === "pix" ? "PIX" : item === "card" ? "Cartão" : "Boleto"}
                </button>
              ))}
            </div>

            {method === "pix" ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <FakeQr />
                <p className="text-center text-xs text-[#666]">
                  QR code de mentira. Não pague nada. A aprovação é automática.
                </p>
              </div>
            ) : null}

            {method === "card" ? (
              <div className="space-y-3">
                <Field label="Número do cartão" value={cardNumber} onChange={setCardNumber} />
                <Field label="Nome no cartão" value={cardName} onChange={setCardName} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Validade" value={cardExpiry} onChange={setCardExpiry} />
                  <Field label="CVV" value={cardCvv} onChange={setCardCvv} />
                </div>
                <p className="text-xs text-[#666]">
                  Qualquer número serve. Nada é enviado a banco ou gateway.
                </p>
              </div>
            ) : null}

            {method === "boleto" ? (
              <div className="rounded-md bg-[#f5f5f5] p-4 font-mono text-center text-xs tracking-[0.3em]">
                23790.00000 00000.000000 00000.000000 0 00000000000000
                <p className="mt-2 font-sans tracking-normal text-[#666]">
                  Boleto eterno. Não precisa pagar.
                </p>
              </div>
            ) : null}

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-md bg-[#eee] py-3 text-sm">
                Voltar
              </button>
              <button
                type="submit"
                disabled={paying}
                className="flex-1 rounded-md bg-[#00a650] py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {paying ? "Processando PresoPago..." : `Finalizar ${formatBRL(total)}`}
              </button>
            </div>
          </section>
        ) : null}
      </div>

      <aside className="h-fit rounded-md bg-white p-4 text-sm">
        <h2 className="font-semibold">Resumo preso</h2>
        <ul className="mt-3 space-y-2">
          {cart.map((item) => (
            <li key={item.product.id} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {item.quantity}× {item.product.title}
              </span>
              <span className="shrink-0">{formatBRL(item.product.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between">
          <span>Frete</span>
          <span>{shipping.price === 0 ? "Grátis" : formatBRL(shipping.price)}</span>
        </p>
        <p className="mt-2 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="text-xs text-[#666]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 outline-none focus:border-[#3483fa]"
      />
    </label>
  );
}

function FakeQr() {
  const cells = Array.from({ length: 121 }, (_, index) => index % 7 === 0 || index % 5 === 2);
  return (
    <div className="grid grid-cols-11 gap-0.5 rounded-md border p-2">
      {cells.map((on, index) => (
        <span key={index} className={`h-2 w-2 ${on ? "bg-[#333]" : "bg-white"}`} />
      ))}
    </div>
  );
}
