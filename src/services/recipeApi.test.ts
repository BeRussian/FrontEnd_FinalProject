import { describe, it, expect } from 'vitest';
import { mapMealDBToRecipe, type MealDBMeal } from './recipeApi';
import { DEFAULT_RECIPE_IMAGE } from '../constants/recipeConstants';

/**
 * Unit Test: TheMealDB API Adapter & Mapping Logic
 * 
 * Verifies that the raw schema from TheMealDB is safely and cleanly converted
 * to our strict EasyBite Recipe interface without `any` types.
 */
describe('TheMealDB API Adapter (mapMealDBToRecipe)', () => {
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
});
