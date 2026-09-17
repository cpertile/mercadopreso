import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-md bg-white p-8 text-center">
      <h1 className="text-xl font-semibold">Essa cela está vazia</h1>
      <p className="mt-2 text-sm text-[#666]">Página ou produto não encontrado.</p>
      <Link href="/" className="mt-4 inline-block text-sm text-[#3483fa]">
        Voltar ao MercadoPreso
      </Link>
    </div>
  );
}
