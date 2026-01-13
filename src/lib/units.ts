import units from "../data/data/units.json";
import type { UnitsData } from "../types";

const U = units as UnitsData;

export function normalizeUnit(input: string): string {
  const k = input.trim().toLowerCase();
  return U.aliases[k] ?? k;
}

export function parsePair(pair: string): { from: string; to: string } {
  const m = pair.toLowerCase().match(/^([a-z0-9-]+)-to-([a-z0-9-]+)$/);
  if (!m) throw new Error(`Invalid pair: ${pair}`);
  return { from: normalizeUnit(m[1]), to: normalizeUnit(m[2]) };
}

export function getVolumeUnit(key: string) {
  return U.volume.find(v => v.key === key);
}
export function getMassUnit(key: string) {
  return U.mass.find(m => m.key === key);
}

export function volumeToMl(value: number, unitKey: string): number {
  const u = getVolumeUnit(unitKey);
  if (!u) throw new Error(`Unknown volume unit: ${unitKey}`);
  return value * u.to_ml;
}

export function gToMass(g: number, unitKey: string): number {
  const u = getMassUnit(unitKey);
  if (!u) throw new Error(`Unknown mass unit: ${unitKey}`);
  return g / u.to_g;
}

export function formatNumber(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return "—";
  const abs = Math.abs(x);
  if (abs === 0) return "0";
  if (abs >= 1000) return x.toFixed(0);
  if (abs >= 100) return x.toFixed(1);
  if (abs >= 10) return x.toFixed(2);
  return x.toFixed(digits);
}
