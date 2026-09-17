import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 text-[#333]">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#333]">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <rect x="6" y="8" width="20" height="16" rx="2" fill="#ffe600" />
          <rect x="10" y="10" width="2.2" height="12" fill="#333" />
          <rect x="15" y="10" width="2.2" height="12" fill="#333" />
          <rect x="20" y="10" width="2.2" height="12" fill="#333" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-[11px] font-semibold tracking-wide uppercase">
          mercado
        </span>
        <span className="block text-xl font-black tracking-tight -mt-0.5">preso</span>
      </span>
    </Link>
  );
}
