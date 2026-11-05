import { describe, it, expect } from 'vitest';
import { DEFAULT_RECIPE_IMAGE } from './recipeConstants';

/**
 * Unit Test: Application Constants & Fallback Assets
 * 
 * Why this test is important:
 * When external API image links break or fail to load, the application
 * must display a clean, valid fallback image URL instead of a broken browser icon.
 */
describe('Application Constants & Fallbacks', () => {
  it('should define a valid default fallback image URL', () => {
    // Explanation: Ensures the fallback image string exists and is not empty
    expect(DEFAULT_RECIPE_IMAGE).toBeDefined();
    expect(typeof DEFAULT_RECIPE_IMAGE).toBe('string');
    expect(DEFAULT_RECIPE_IMAGE.length).toBeGreaterThan(0);
  });

  it('should use an HTTPS URL for security and modern browser compliance', () => {
    // Explanation: Mixed-content policy blocks HTTP images on secure sites; must start with https://
    expect(DEFAULT_RECIPE_IMAGE.startsWith('https://')).toBe(true);
  });
});

