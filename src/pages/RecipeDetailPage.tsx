import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';

/**
 * RecipeDetailPage (Detail View):
 * Reads dynamic `:id` parameter from URL via `useParams()`.
 */
export const RecipeDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = mockRecipes.find((item) => item.id === id);

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to Catalog
      </Link>

      {recipe ? (
        <article>
          <h1>📖 {recipe.title}</h1>
          <p><strong>Route Parameter (useParams ID):</strong> {id}</p>
          <p><strong>Category:</strong> {recipe.category} | <strong>Prep Time:</strong> {recipe.prepTime}</p>
          <p><strong>Description:</strong> {recipe.description}</p>
        </article>
      ) : (
        <article>
          <h1>Recipe Not Found</h1>
          <p>No recipe matches ID "{id}".</p>
        </article>
      )}
    </main>
  );
};
