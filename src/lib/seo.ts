const CANON_HOST = "https://numericano.com";

export function canonicalUrl(pathname: string): string {
  const p0 = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const p = p0.endsWith("/") ? p0 : `${p0}/`;
  return `${CANON_HOST}${p}`;
}

export function buildTitle(parts: string[]): string {
  return `${parts.filter(Boolean).join(" · ")} | Numericano`;
}

export function buildDescription(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > 155 ? t.slice(0, 152) + "…" : t;
}
