import type { Recipe } from '../types/recipe';
import { DEFAULT_RECIPE_IMAGE } from '../constants/recipeConstants';

/**
 * Raw MealDB meal interface (partial representation of TheMealDB API JSON schema).
 */
export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

const THE_MEAL_DB_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

/**
 * Adapter function that maps a raw MealDB meal object into our strict Recipe interface.
 * 
 * Why an Adapter?
 * - Decouples our application components from external third-party API field names.
 * - Extracts and cleans up ingredients dynamically (from strIngredient1..20).
 * - Ensures zero `any` types and guarantees default fallback values.
 */
export const mapMealDBToRecipe = (meal: MealDBMeal): Recipe => {
  // Extract non-empty ingredients + measurements
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim().length > 0) {
      const cleanMeasure = measure && measure.trim() ? `${measure.trim()} ` : '';
      ingredients.push(`${cleanMeasure}${ingredient.trim()}`);
    }
  }

  // Split raw instructions block into clean individual steps
  const rawInstructions = meal.strInstructions || '';
  const parsedSteps = rawInstructions
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter((step) => step.length > 5);

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory || 'General',
    image: meal.strMealThumb || DEFAULT_RECIPE_IMAGE,
    prepTime: parsedSteps.length <= 4 ? '10 mins' : '15 mins',
    difficulty: 'Level 1',
    description: `A delicious ${meal.strCategory || 'homemade'} recipe made in easy steps.`,
    ingredients:
      ingredients.length > 0
        ? ingredients
        : ['Basic pantry items (check directions below)'],
    instructions:
      parsedSteps.length > 0
        ? parsedSteps
        : [rawInstructions || 'Follow standard preparation steps.']
  };
};

/**
 * Fetches live recipes from TheMealDB public API.
 * Throws a typed Error if network request fails or API returns unexpected data.
 */
export const fetchLiveRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(THE_MEAL_DB_URL);

  if (!response.ok) {
    throw new Error(`TheMealDB API returned HTTP status ${response.status}`);
  }

  const data: MealDBResponse = await response.json();

  if (!data.meals || data.meals.length === 0) {
    throw new Error('No recipes found from TheMealDB API');
  }

  return data.meals.map(mapMealDBToRecipe);
};
