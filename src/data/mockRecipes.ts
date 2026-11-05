import type { Recipe } from '../types/recipe';

/**
 * Local mock data for development and testing.
 * 
 * Why mock data?
 * - Allows building UI components, layout, and routing independently from network availability.
 * - Guarantees consistent test fixtures.
 */
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Golden Grilled Cheese',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    prepTime: '8 mins',
    difficulty: 'Level 1',
    description: 'Crispy buttery bread with perfectly melted cheddar cheese.',
    ingredients: [
      '2 slices of bread',
      '2 slices of cheddar cheese',
      '1 tablespoon of butter',
      'A pinch of salt'
    ],
    instructions: [
      'Spread butter evenly on one side of each bread slice.',
      'Place one slice butter-side down in a non-stick skillet on medium heat.',
      'Layer the cheese on top and close with the second slice, butter-side up.',
      'Cook for 3-4 minutes per side until golden brown and melted.'
    ]
  },
  {
    id: '2',
    title: 'Easy Fluffy Scrambled Eggs',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    prepTime: '5 mins',
    difficulty: 'Level 1',
    description: 'Soft, creamy scrambled eggs made in just five minutes.',
    ingredients: [
      '3 fresh eggs',
      '1 tablespoon of milk or cream',
      '1 teaspoon of butter',
      'Salt and black pepper to taste'
    ],
    instructions: [
      'Crack eggs into a small bowl, add milk, salt, and pepper, then whisk gently.',
      'Melt butter in a skillet over low-medium heat.',
      'Pour in egg mixture and gently stir with a spatula until soft curds form.',
      'Remove from heat while slightly glossy and serve immediately.'
    ]
  },
  {
    id: '3',
    title: '15-Minute Garlic & Tomato Pasta',
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281744?w=600&auto=format&fit=crop&q=80',
    prepTime: '15 mins',
    difficulty: 'Level 1',
    description: 'A comforting bowl of spaghetti tossed with garlic and rich tomato sauce.',
    ingredients: [
      '150g spaghetti',
      '2 cloves of minced garlic',
      '1 cup of tomato passata or canned crushed tomatoes',
      '2 tablespoons of olive oil',
      'Fresh basil or dried oregano'
    ],
    instructions: [
      'Boil spaghetti in salted water according to package instructions (about 9 mins).',
      'In a pan, warm olive oil and sauté minced garlic for 1 minute until fragrant.',
      'Add tomato sauce, a pinch of salt and simmer for 5 minutes.',
      'Drain cooked pasta and toss directly into the warm sauce. Serve with basil.'
    ]
  }
];
