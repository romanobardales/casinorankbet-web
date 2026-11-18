import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ casino: string }> }
) {
  const { casino } = await context.params;

  const { data, error } = await supabase
    .from("casinos")
    .select("affiliate_url")
    .eq("slug", casino)
    .single();

  if (error || !data?.affiliate_url) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(data.affiliate_url, {
    status: 307,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}