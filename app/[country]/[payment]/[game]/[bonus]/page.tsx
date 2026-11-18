import { Suspense } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{
    country: string;
    payment: string;
    game: string;
    bonus: string;
  }>;
};

async function getSeoPage(country: string, payment: string, game: string, bonus: string) {
  "use cache";

  const { data, error } = await supabase
    .from("seo_content")
    .select(`
      h1_title,
      body_html,
      countries!inner(slug, name),
      payment_methods!inner(slug, name),
      game_types!inner(slug, name),
      bonus_types!inner(slug, name)
    `)
    .eq("countries.slug", country)
    .eq("payment_methods.slug", payment)
    .eq("game_types.slug", game)
    .eq("bonus_types.slug", bonus)
    .single();

  if (error || !data) return null;
  return data;
}

async function getTopCasinos() {
  "use cache";

  const { data } = await supabase
    .from("casinos")
    .select("slug, name, rating")
    .order("rating", { ascending: false })
    .limit(3);

  return data ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, payment, game, bonus } = await params;
  const page = await getSeoPage(country, payment, game, bonus);

  if (!page) return { title: "Página no encontrada | CasinoRankBet" };

  return {
    title: `${page.h1_title} | CasinoRankBet`,
    description: `Guía actualizada: ${page.h1_title}. Depósitos rápidos y bonos verificados.`,
  };
}

async function SeoArticle({ params }: PageProps) {
  const { country, payment, game, bonus } = await params;
  const [page, casinos] = await Promise.all([
    getSeoPage(country, payment, game, bonus),
    getTopCasinos(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-4 text-xs uppercase tracking-wider text-emerald-400 font-semibold">
        {country} · {payment} · {game}
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 leading-tight">
        {page.h1_title}
      </h1>

      <section className="space-y-4 mb-10">
        {casinos.map((casino) => (
          <div
            key={casino.slug}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div>
              <h2 className="text-xl font-bold text-white">{casino.name}</h2>
              <p className="text-sm text-amber-400">Valoración: {casino.rating} / 5.0</p>
            </div>
            <a
              href={`/out/${casino.slug}`}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-block text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition"
            >
              Reclamar Bono →
            </a>
          </div>
        ))}
      </section>

      <div
        className="text-slate-300 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-emerald-300 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-2 [&_strong]:text-white"
        dangerouslySetInnerHTML={{ __html: page.body_html }}
      />
    </article>
  );
}

export default function DynamicSeoPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <Suspense fallback={<div className="max-w-3xl mx-auto text-slate-400">Cargando guía...</div>}>
        <SeoArticle params={params} />
      </Suspense>
    </main>
  );
}