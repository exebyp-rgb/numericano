/**
 * Centralized data imports
 * All page routes should import data ONLY from this file
 */

import ingredientsRaw from "../data/data/ingredients.json";
import cookingPairsRaw from "../data/data/cookingPairs.json";

export type IngredientVariant = {
  key: string;
  label: string;
  density_g_ml: number;
};

export type Ingredient = {
  slug: string;
  name: string;
  synonyms: string[];
  category: string;
  defaultVariant: string;
  variants: IngredientVariant[];
  notes: string;
  sources: string[];
};

export type CookingPair = {
  from: "tsp" | "tbsp" | "cup" | "ml" | "g" | "oz";
  to: "tsp" | "tbsp" | "cup" | "ml" | "g" | "oz";
};

export const ingredients = ingredientsRaw as Ingredient[];
export const cookingPairs = cookingPairsRaw as CookingPair[];
