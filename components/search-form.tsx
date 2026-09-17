"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    router.push(value ? `/busca?q=${encodeURIComponent(value)}` : "/busca");
  }

  return (
    <form
      key={q}
      onSubmit={onSubmit}
      className="flex w-full min-w-0 overflow-hidden rounded-sm bg-white shadow-sm"
    >
      <input
        name="q"
        defaultValue={q}
        placeholder="Buscar no MercadoPreso"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#333] outline-none placeholder:text-[#999]"
        autoComplete="off"
      />
      <button
        type="submit"
        className="flex items-center justify-center px-3 text-[#666] hover:bg-black/5"
        aria-label="Buscar"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
      </button>
    </form>
  );
}
