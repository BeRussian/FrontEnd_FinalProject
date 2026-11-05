import type { Recipe } from '../types/recipe';

/**
 * Pure Utility Functions for Recipe Logic (EasyBite)
 * 
 * Why Pure Functions?
 * - Predictable: given the same arguments, they always return the same result.
 * - No side effects: they do not modify external state, network, or DOM.
 * - Extremely easy to unit test and explain during an oral defense.
 */

/**
 * Filters a list of recipes based on a text search query and a category filter.
 * 
 * Rules:
 * - Query matches either recipe title OR any of the recipe's ingredients.
 * - Matching is case-insensitive.
 * - Category 'All' matches all recipes.
 */
export const filterRecipes = (
  recipes: Recipe[],
  query: string,
  category: string
): Recipe[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  return recipes.filter((recipe) => {
    // 1. Category check
    const matchesCategory =
      normalizedCategory === 'all' ||
      normalizedCategory === '' ||
      recipe.category.toLowerCase() === normalizedCategory;

    if (!matchesCategory) return false;

    // 2. Query check (if query is empty, it matches everything in that category)
    if (!normalizedQuery) return true;

    const matchesTitle = recipe.title.toLowerCase().includes(normalizedQuery);
    const matchesIngredient = recipe.ingredients.some((ing) =>
      ing.toLowerCase().includes(normalizedQuery)
    );

    return matchesTitle || matchesIngredient;
  });
};

/**
 * Selects a random recipe from an array of recipes.
 * Returns null if the array is empty.
 */
export const getRandomRecipe = (recipes: Recipe[]): Recipe | null => {
  if (!recipes || recipes.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return recipes[randomIndex];
};

/**
 * Extracts and aggregates all ingredients from a list of recipes into a clean,
 * deduplicated list for the shopping list feature.
 */
export const extractShoppingList = (recipes: Recipe[]): string[] => {
  if (!recipes || recipes.length === 0) {
    return [];
  }

  const allIngredients: string[] = [];

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const trimmed = ing.trim();
      if (trimmed && !allIngredients.includes(trimmed)) {
        allIngredients.push(trimmed);
      }
    });
  });

  return allIngredients;
};

/**
 * Toggles a recipe ID inside a favorites array.
 * If the ID exists, it removes it. If it does not exist, it appends it.
 * Guarantees no duplicate IDs.
 */
export const toggleFavoriteId = (
  currentFavoriteIds: string[],
  recipeId: string
): string[] => {
  if (!recipeId) return currentFavoriteIds;

  const exists = currentFavoriteIds.includes(recipeId);
  if (exists) {
    return currentFavoriteIds.filter((id) => id !== recipeId);
  } else {
    return [...currentFavoriteIds, recipeId];
  }
};

