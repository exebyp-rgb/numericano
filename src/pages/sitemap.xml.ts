import { ingredients, cookingPairs } from "@/lib/data";

const BUILT_INGREDIENT_COUNT = 50;
const BUILT_PAIRS_PER_INGREDIENT = 10;

export async function GET() {
  const baseUrl = "https://numericano.com";

  // Helper to escape XML special characters
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  // Build sitemap entries
  const entries = [
    // Homepage
    {
      url: baseUrl,
      changefreq: "weekly",
      priority: "1.0",
    },
    // About page
    {
      url: `${baseUrl}/about/`,
      changefreq: "monthly",
      priority: "0.7",
    },
    // Cooking index
    {
      url: `${baseUrl}/cooking/`,
      changefreq: "weekly",
      priority: "0.9",
    },
    // Browse ingredients
    {
      url: `${baseUrl}/ingredients/`,
      changefreq: "weekly",
      priority: "0.9",
    },
    // Volume-weight page
    {
      url: `${baseUrl}/volume-weight/`,
      changefreq: "monthly",
      priority: "0.7",
    },
  ];

  // Add ingredient hub pages (first 50)
  const builtIngs = ingredients.slice(0, BUILT_INGREDIENT_COUNT);
  builtIngs.forEach((ing) => {
    entries.push({
      url: `${baseUrl}/cooking/${ing.slug}/`,
      changefreq: "monthly",
      priority: "0.8",
    });
  });

  // Add individual ingredient pages (all)
  ingredients.forEach((ing) => {
    entries.push({
      url: `${baseUrl}/ingredients/${ing.slug}/`,
      changefreq: "monthly",
      priority: "0.7",
    });
  });

  // Add conversion pages (first 50 ingredients × first 10 pairs)
  const builtPairs = cookingPairs.slice(0, BUILT_PAIRS_PER_INGREDIENT);
  builtIngs.forEach((ing) => {
    builtPairs.forEach((pair) => {
      entries.push({
        url: `${baseUrl}/cooking/${ing.slug}/${pair.from}-to-${pair.to}/`,
        changefreq: "monthly",
        priority: "0.6",
      });
    });
  });

  // Add blog pages (if they exist)
  entries.push({
    url: `${baseUrl}/blog/`,
    changefreq: "weekly",
    priority: "0.8",
  });

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
