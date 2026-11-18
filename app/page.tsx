import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CasinoRankBet | Guías de Casinos, Bonos y Pagos Verificados",
  description:
    "Compara los mejores casinos online por país, método de pago, juego y tipo de bono. Guías actualizadas y enlaces verificados.",
};

type SeoGuide = {
  h1_title: string;
  countries: { slug: string; name: string } | { slug: string; name: string }[];
  payment_methods: { slug: string; name: string } | { slug: string; name: string }[];
  game_types: { slug: string; name: string } | { slug: string; name: string }[];
  bonus_types: { slug: string; name: string } | { slug: string; name: string }[];
};

function unwrap<T>(val: T | T[]): T {
  return Array.isArray(val) ? val[0] : val;
}

async function getAllGuides() {
  "use cache";

  const { data } = await supabase
    .from("seo_content")
    .select(`
      h1_title,
      countries!inner(slug, name),
      payment_methods!inner(slug, name),
      game_types!inner(slug, name),
      bonus_types!inner(slug, name)
    `)
    .limit(50);

  return (data as SeoGuide[] | null) ?? [];
}

export default async function HomePage() {
  const guides = await getAllGuides();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
            CasinoRankBet
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Guías de Casinos y Bonos Verificados
          </h1>
          <p className="text-slate-400 text-lg">
            Encuentra las mejores plataformas según tu país, método de pago y juego favorito.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide, index) => {
            const country = unwrap(guide.countries);
            const payment = unwrap(guide.payment_methods);
            const game = unwrap(guide.game_types);
            const bonus = unwrap(guide.bonus_types);
            const href = `/${country.slug}/${payment.slug}/${game.slug}/${bonus.slug}`;

            return (
              <Link
                key={index}
                href={href}
                className="block bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-xl p-5 transition"
              >
                <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                  {country.name} · {payment.name} · {game.name}
                </div>
                <h2 className="text-lg font-bold text-white leading-snug mb-3">
                  {guide.h1_title}
                </h2>
                <span className="text-sm text-emerald-400 font-medium">
                  Ver guía completa →
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}