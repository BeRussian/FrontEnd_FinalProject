/**
 * TypeScript Interface representing a single Recipe in EasyBite.
 * 
 * Strict type safety rules:
 * - NO `any` types allowed anywhere.
 * - Every field is explicitly typed to catch errors during compile-time.
 */
export interface Recipe {
  /** Unique identifier, used for routing (/recipes/:id) and React keys */
  id: string;

  /** Display title of the recipe */
  title: string;

  /** Category classification (e.g. "Breakfast", "Pasta", "Starter") */
  category: string;

  /** Image URL for visual presentation */
  image: string;

  /** Total preparation time estimate (e.g. "10 mins") */
  prepTime: string;

  /** Constant difficulty indicator for beginners */
  difficulty: 'Level 1';

  /** Friendly one-line summary */
  description: string;

  /** List of simple ingredients */
  ingredients: string[];

  /** Ordered step-by-step preparation directions */
  instructions: string[];
}
