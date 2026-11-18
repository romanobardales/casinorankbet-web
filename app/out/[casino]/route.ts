import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  // 1. Buscar el enlace de afiliado del casino en Supabase
  const { data: casino } = await supabase
    .from("casinos")
    .select("slug, affiliate_url")
    .eq("slug", slug)
    .single();

  // Si el casino no existe o aún no tiene URL de afiliado, volver a la portada
  if (!casino?.affiliate_url) {
    return NextResponse.redirect(new URL("/", request.url), { status: 307 });
  }

  // 2. Extraer datos útiles para analítica (guía de origen y país real)
  const referer = request.headers.get("referer");
  let refererPath = "direct";
  if (referer) {
    try {
      refererPath = new URL(referer).pathname;
    } catch {
      refererPath = referer.slice(0, 200);
    }
  }

  const countryCode = request.headers.get("x-vercel-ip-country") ?? "UNKNOWN";
  const userAgent = request.headers.get("user-agent")?.slice(0, 255) ?? "UNKNOWN";

  // 3. Registrar el clic sin bloquear la redirección si falla la BD
  try {
    await supabase.from("affiliate_clicks").insert({
      casino_slug: casino.slug,
      referer_path: refererPath,
      country_code: countryCode,
      user_agent: userAgent,
    });
  } catch (err) {
    console.error("Error registrando clic de afiliado:", err);
  }

  // 4. Redirección 307 limpia, sin caché y no indexable
  return NextResponse.redirect(casino.affiliate_url, {
    status: 307,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}