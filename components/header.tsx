import { categories } from "@/lib/catalog";
import Link from "next/link";
import { CartBadge } from "./cart-badge";
import { Logo } from "./logo";
import { SearchForm } from "./search-form";
import { SimulationBanner } from "./simulation-banner";

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <SimulationBanner />
      <div className="bg-mp-yellow">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 md:gap-6 md:py-3">
          <Logo />
          <SearchForm />
          <CartBadge className="hidden text-[#333] md:flex" />
        </div>
        <nav className="mx-auto hidden max-w-6xl gap-4 overflow-x-auto px-3 pb-2 text-xs text-[#333] md:flex">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="whitespace-nowrap hover:underline"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/meus-pedidos" className="ml-auto whitespace-nowrap hover:underline">
            Meus pedidos
          </Link>
        </nav>
      </div>
    </header>
  );
}
