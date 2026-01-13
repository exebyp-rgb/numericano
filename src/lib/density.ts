import ingredients from "../data/data/ingredients.json";
import type { Ingredient } from "../types";

const ING = ingredients as Ingredient[];

export function getIngredient(slug: string): Ingredient | undefined {
  return ING.find(i => i.slug === slug);
}

export function getVariant(ingredient: Ingredient, variantKey?: string) {
  const key =
    variantKey && ingredient.variants.some(v => v.key === variantKey)
      ? variantKey
      : ingredient.defaultVariant;
  return ingredient.variants.find(v => v.key === key) ?? ingredient.variants[0];
}

export function getDensityGPerMl(ingredient: Ingredient, variantKey?: string): number {
  return getVariant(ingredient, variantKey).density_g_ml;
}

export function getDensityRangeGPerMl(ingredient: Ingredient): { min: number; max: number } {
  const ds = ingredient.variants.map(v => v.density_g_ml).filter(n => Number.isFinite(n));
  return { min: Math.min(...ds), max: Math.max(...ds) };
}
