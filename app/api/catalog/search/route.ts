import { searchCatalog } from "@/lib/catalog";
import type { SearchParams } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sort = searchParams.get("sort");
  const params: SearchParams = {
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: sort === "price_asc" || sort === "price_desc" ? sort : "relevance",
    limit: Number(searchParams.get("limit") ?? 48),
    offset: Number(searchParams.get("offset") ?? 0),
  };
  const result = await searchCatalog(params);
  return NextResponse.json(result);
}
