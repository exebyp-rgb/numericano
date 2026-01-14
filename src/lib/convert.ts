export type VolumeUnit = "tsp" | "tbsp" | "cup" | "ml" | "l";
export type MassUnit = "g" | "kg" | "oz" | "lb";

const ML_PER: Record<Exclude<VolumeUnit, "ml">, number> = {
  l: 1000,
  tsp: 4.92892159375,
  tbsp: 14.78676478125,
  cup: 236.5882365,
};

const G_PER: Record<Exclude<MassUnit, "g">, number> = {
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
};

export function volumeToMl(v: number, u: VolumeUnit): number {
  if (u === "ml") return v;
  return v * ML_PER[u];
}

export function gToUnit(g: number, u: MassUnit): number {
  if (u === "g") return g;
  return g / G_PER[u];
}

export function volumeToMass(v: number, vUnit: VolumeUnit, density_g_per_ml: number, mUnit: MassUnit): number {
  const ml = volumeToMl(v, vUnit);
  const g = ml * density_g_per_ml;
  return gToUnit(g, mUnit);
}

export function fmt(x: number): string {
  const s = x.toFixed(2);
  return s.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
