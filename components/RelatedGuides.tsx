import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

type RelatedGuidesProps = {
  countrySlug: string;
  paymentSlug: string;
  gameSlug: string;
  bonusSlug: string;
};

async function getRelatedGuides({
  countrySlug,
  paymentSlug,
  gameSlug,
  bonusSlug,
}: RelatedGuidesProps) {
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
    .eq("countries.slug", countrySlug)
    .limit(40);

  const guides = (data as SeoGuide[] | null) ?? [];

  // Filtrar la página actual y ordenar por relevancia (mismo juego o mismo pago primero)
  return guides
    .map((g) => {
      const country = unwrap(g.countries);
      const payment = unwrap(g.payment_methods);
      const game = unwrap(g.game_types);
      const bonus = unwrap(g.bonus_types);

      const isCurrent =
        country.slug === countrySlug &&
        payment.slug === paymentSlug &&
        game.slug === gameSlug &&
        bonus.slug === bonusSlug;

      let score = 0;
      if (game.slug === gameSlug) score += 2;
      if (payment.slug === paymentSlug) score += 2;
      if (bonus.slug === bonusSlug) score += 1;

      return {
        h1_title: g.h1_title,
        country,
        payment,
        game,
        bonus,
        href: `/${country.slug}/${payment.slug}/${game.slug}/${bonus.slug}`,
        isCurrent,
        score,
      };
    })
    .filter((item) => !item.isCurrent)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export default async function RelatedGuides(props: RelatedGuidesProps) {
  const related = await getRelatedGuides(props);

  if (related.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-2">
        Guías relacionadas
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Explora otros bonos, juegos y métodos de pago verificados en el mismo país.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {related.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="block bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-xl p-5 transition"
          >
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">
              {guide.payment.name} · {guide.game.name}
            </div>
            <h3 className="text-base font-bold text-white leading-snug mb-2">
              {guide.h1_title}
            </h3>
            <span className="text-sm text-emerald-400 font-medium">
              Ver guía →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}