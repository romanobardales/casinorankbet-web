import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://casinorankbet.com";

type SitemapRow = {
  countries: { slug: string } | { slug: string }[];
  payment_methods: { slug: string } | { slug: string }[];
  game_types: { slug: string } | { slug: string }[];
  bonus_types: { slug: string } | { slug: string }[];
};

function unwrap<T>(val: T | T[]): T {
  return Array.isArray(val) ? val[0] : val;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("seo_content").select(`
    countries!inner(slug),
    payment_methods!inner(slug),
    game_types!inner(slug),
    bonus_types!inner(slug)
  `);

  const rows = (data as SitemapRow[] | null) ?? [];

  const dynamicRoutes: MetadataRoute.Sitemap = rows.map((row) => {
    const country = unwrap(row.countries).slug;
    const payment = unwrap(row.payment_methods).slug;
    const game = unwrap(row.game_types).slug;
    const bonus = unwrap(row.bonus_types).slug;

    return {
      url: `${BASE_URL}/${country}/${payment}/${game}/${bonus}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...dynamicRoutes,
  ];
}