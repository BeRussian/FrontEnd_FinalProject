import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';

/**
 * CatalogPage (Home / Master View):
 * Minimal starter view displaying the catalog heading and links to recipes.
 */
export const CatalogPage: FC = () => {
  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🍳 EasyBite: Recipe Catalog (Master View)</h1>
      <p>Welcome to EasyBite! Level 1 cooking for beginners.</p>

      <h2>Sample Recipes (Click to test Master-Detail routing):</h2>
      <ul>
        {mockRecipes.map((recipe) => (
          <li key={recipe.id} style={{ margin: '0.5rem 0' }}>
            <Link to={`/recipes/${recipe.id}`} style={{ fontWeight: 'bold' }}>
              {recipe.title}
            </Link>{' '}
            <span>— {recipe.prepTime} ({recipe.category})</span>
          </li>
        ))}
      </ul>
    </main>
  );
};
