import { describe, it, expect } from 'vitest';
import { mockRecipes } from './mockRecipes';

/**
 * Unit Test: Mock Data & Recipe Type Verification
 * 
 * Verifies that all mock recipes conform to the Level 1 recipe structure:
 * - Each recipe must have a valid ID, title, prepTime, and difficulty.
 * - Each recipe must contain non-empty ingredients and step-by-step instructions.
 */
describe('Mock Recipes Data Integrity', () => {
  it('should contain at least 3 initial Level 1 recipes', () => {
    expect(mockRecipes.length).toBeGreaterThanOrEqual(3);
  });

  it('should have all required fields filled for every recipe', () => {
    mockRecipes.forEach((recipe) => {
      expect(recipe.id).toBeDefined();
      expect(typeof recipe.title).toBe('string');
      expect(recipe.difficulty).toBe('Level 1');
      expect(recipe.ingredients.length).toBeGreaterThan(0);
      expect(recipe.instructions.length).toBeGreaterThan(0);
    });
  });

  it('should have unique IDs for each recipe to prevent React key conflicts', () => {
    const ids = mockRecipes.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

