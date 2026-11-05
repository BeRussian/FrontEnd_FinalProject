import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapMealDBToRecipe, fetchLiveRecipes, type MealDBMeal } from './recipeApi';
import { DEFAULT_RECIPE_IMAGE } from '../constants/recipeConstants';

/**
 * Unit & Integration Tests: TheMealDB API Adapter & Failure Simulations
 * 
 * Demonstrates:
 * 1. Schema mapping from raw MealDB object to Recipe interface.
 * 2. Network failure simulations (HTTP 500, fetch rejection, null payloads).
 */
describe('TheMealDB API Adapter & Network Failure Simulations', () => {
  afterEach(() => {
    // Restore any mocked functions after each test to keep tests isolated
    vi.restoreAllMocks();
  });
  const sampleRawMeal: MealDBMeal = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions:
      'Preheat oven to 350° F.\r\nCombine sauce ingredients.\r\nBake for 30 minutes.',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strIngredient1: 'Soy Sauce',
    strMeasure1: '3/4 cup',
    strIngredient2: 'Water',
    strMeasure2: '1/2 cup',
    strIngredient3: '',
    strMeasure3: ''
  };

  it('should map id, title, and category correctly', () => {
    const recipe = mapMealDBToRecipe(sampleRawMeal);
    expect(recipe.id).toBe('52772');
    expect(recipe.title).toBe('Teriyaki Chicken Casserole');
    expect(recipe.category).toBe('Chicken');
  });

  it('should extract and combine measurements with ingredients', () => {
    const recipe = mapMealDBToRecipe(sampleRawMeal);
    expect(recipe.ingredients).toContain('3/4 cup Soy Sauce');
    expect(recipe.ingredients).toContain('1/2 cup Water');
    expect(recipe.ingredients.length).toBe(2);
  });

  it('should split raw multi-line instructions into an array of distinct steps', () => {
    const recipe = mapMealDBToRecipe(sampleRawMeal);
    expect(recipe.instructions.length).toBe(3);
    expect(recipe.instructions[0]).toBe('Preheat oven to 350° F.');
  });

  it('should fallback to DEFAULT_RECIPE_IMAGE when strMealThumb is missing or empty', () => {
    const rawMealWithoutImage: MealDBMeal = {
      ...sampleRawMeal,
      strMealThumb: ''
    };
    const recipe = mapMealDBToRecipe(rawMealWithoutImage);
    expect(recipe.image).toBe(DEFAULT_RECIPE_IMAGE);
  });

  it('should enforce Level 1 difficulty constant on all converted recipes', () => {
    const recipe = mapMealDBToRecipe(sampleRawMeal);
    expect(recipe.difficulty).toBe('Level 1');
  });

  // =======================================================
  // Network Failure Simulations (How API Errors are Caught)
  // =======================================================
  describe('fetchLiveRecipes - Failure Scenarios & Error Propagation', () => {
    it('should throw an informative error when network request rejects (offline simulation)', async () => {
      // Simulation: Simulates user having no internet or DNS failing
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
        new Error('Failed to fetch (Network connection lost)')
      );

      await expect(fetchLiveRecipes()).rejects.toThrow(
        'Failed to fetch (Network connection lost)'
      );
    });

    it('should throw when the API server responds with HTTP 500 error', async () => {
      // Simulation: Simulates TheMealDB server crashing with internal 500 error
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      await expect(fetchLiveRecipes()).rejects.toThrow(
        'TheMealDB API returned HTTP status 500'
      );
    });

    it('should throw when API returns empty/null meals array', async () => {
      // Simulation: Simulates API returning empty result payload
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ meals: null })
      } as Response);

      await expect(fetchLiveRecipes()).rejects.toThrow(
        'No recipes found from TheMealDB API'
      );
    });
  });
});

