import { describe, it, expect } from 'vitest';
import {
  filterRecipes,
  getRandomRecipe,
  extractShoppingList,
  toggleFavoriteId
} from './recipeUtils';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Test Suite: Recipe Business Logic & Utility Functions
 * 
 * Philosophy:
 * Thorough unit tests covering real-world business scenarios, edge cases,
 * and data transformations.
 */
describe('Recipe Business Logic (TDD Suite)', () => {
  // ==========================================
  // Section 1: Text Search Query Filtering
  // ==========================================
  describe('filterRecipes - Text Search Query', () => {
    it('should find recipes matching title case-insensitively', () => {
      // Explanation: User searching for "CHEESE" should find "Golden Grilled Cheese"
      const results = filterRecipes(mockRecipes, 'CHEESE', 'All');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Golden Grilled Cheese');
    });

    it('should find recipes matching an ingredient', () => {
      // Explanation: User searching for "garlic" should find the Pasta recipe even though "garlic" is not in the title
      const results = filterRecipes(mockRecipes, 'garlic', 'All');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('15-Minute Garlic & Tomato Pasta');
    });

    it('should return all recipes when the query is empty or whitespace only', () => {
      // Explanation: An empty search box must not filter out any recipes
      const results = filterRecipes(mockRecipes, '   ', 'All');
      expect(results.length).toBe(mockRecipes.length);
    });

    it('should return an empty array when no title or ingredient matches', () => {
      // Explanation: Searching for a non-existent dish (e.g., "Sushi") should result in 0 matches
      const results = filterRecipes(mockRecipes, 'NonExistentDishXYZ', 'All');
      expect(results.length).toBe(0);
    });
  });

  // ==========================================
  // Section 2: Category Filtering
  // ==========================================
  describe('filterRecipes - Category Filter', () => {
    it('should filter recipes strictly by selected category', () => {
      // Explanation: Clicking "Breakfast" should return only breakfast dishes (Grilled Cheese, Scrambled Eggs)
      const results = filterRecipes(mockRecipes, '', 'Breakfast');
      expect(results.length).toBe(2);
      expect(results.every((r) => r.category === 'Breakfast')).toBe(true);
    });

    it('should return all recipes when category is "All"', () => {
      // Explanation: "All" category acts as a reset button
      const results = filterRecipes(mockRecipes, '', 'All');
      expect(results.length).toBe(mockRecipes.length);
    });

    it('should handle case-insensitive category matching', () => {
      // Explanation: Passing "pasta" or "PASTA" should match "Pasta"
      const results = filterRecipes(mockRecipes, '', 'pasta');
      expect(results.length).toBe(1);
      expect(results[0].category).toBe('Pasta');
    });
  });

  // ==========================================
  // Section 3: Combined Search + Category Filter
  // ==========================================
  describe('filterRecipes - Combined Filtering', () => {
    it('should apply both category and search query simultaneously', () => {
      // Explanation: In category "Breakfast", search for "eggs" -> should find only Scrambled Eggs (1 item)
      const results = filterRecipes(mockRecipes, 'eggs', 'Breakfast');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Easy Fluffy Scrambled Eggs');
    });

    it('should return empty array if query matches an item in another category', () => {
      // Explanation: "spaghetti" exists in Pasta category, so searching "spaghetti" under "Breakfast" must yield 0
      const results = filterRecipes(mockRecipes, 'spaghetti', 'Breakfast');
      expect(results.length).toBe(0);
    });
  });

  // ==========================================
  // Section 4: Random Recipe Generator
  // ==========================================
  describe('getRandomRecipe', () => {
    it('should return a valid recipe from a non-empty array', () => {
      // Explanation: The random recipe generator must always return an element present in the list
      const random = getRandomRecipe(mockRecipes);
      expect(random).not.toBeNull();
      expect(mockRecipes.some((r) => r.id === random?.id)).toBe(true);
    });

    it('should safely return null when called with an empty array without throwing', () => {
      // Explanation: Edge case: If catalog is empty, it shouldn't crash with undefined index
      const random = getRandomRecipe([]);
      expect(random).toBeNull();
    });
  });

  // ==========================================
  // Section 5: Shopping List Extraction
  // ==========================================
  describe('extractShoppingList', () => {
    it('should aggregate ingredients across multiple recipes', () => {
      // Explanation: Combines ingredients from recipe 1 and recipe 2
      const list = extractShoppingList([mockRecipes[0], mockRecipes[1]]);
      expect(list.length).toBeGreaterThan(0);
      expect(list).toContain('2 slices of bread');
      expect(list).toContain('3 fresh eggs');
    });

    it('should deduplicate identical ingredient strings', () => {
      // Explanation: If both recipes list identical items, avoid duplicate entries on the shopping list
      const duplicateRecipe = {
        ...mockRecipes[0],
        id: '99',
        ingredients: ['2 slices of bread', 'New item']
      };
      const list = extractShoppingList([mockRecipes[0], duplicateRecipe]);
      const breadOccurrences = list.filter((item) => item === '2 slices of bread');
      expect(breadOccurrences.length).toBe(1);
    });

    it('should return an empty array when given an empty list of recipes', () => {
      // Explanation: Edge case: No favorited recipes means an empty shopping list
      expect(extractShoppingList([])).toEqual([]);
    });
  });

  // ==========================================
  // Section 6: Favorites Management (Toggle ID)
  // ==========================================
  describe('toggleFavoriteId', () => {
    it('should add an ID to favorites when not currently present', () => {
      // Explanation: Clicking heart on an unfavorited item adds it
      const current = ['1'];
      const updated = toggleFavoriteId(current, '2');
      expect(updated).toEqual(['1', '2']);
    });

    it('should remove an ID from favorites when it is already present', () => {
      // Explanation: Clicking heart on an already favorited item removes it
      const current = ['1', '2', '3'];
      const updated = toggleFavoriteId(current, '2');
      expect(updated).toEqual(['1', '3']);
    });

    it('should never produce duplicate IDs in the favorites array', () => {
      // Explanation: Data integrity: an ID can appear at most once
      const current = ['1', '2'];
      const updated = toggleFavoriteId(current, '3');
      const uniqueSet = new Set(updated);
      expect(uniqueSet.size).toBe(updated.length);
    });
  });
});

