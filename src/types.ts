export type UnitVolume = { key: string; label: string; to_ml: number };
export type UnitMass = { key: string; label: string; to_g: number };
export type UnitsData = {
  volume: UnitVolume[];
  mass: UnitMass[];
  aliases: Record<string, string>;
};

export type IngredientVariant = { key: string; label: string; density_g_ml: number };

export type Ingredient = {
  slug: string;
  name: string;
  synonyms: string[];
  category: "cooking" | "materials" | string;
  defaultVariant: string;
  variants: IngredientVariant[];
  notes: string;
  sources: string[];
};
