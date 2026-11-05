import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { RecipeCard } from '../components/RecipeCard';

interface FavoritesPageProps {
  recipes: Recipe[];
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string, recipeTitle: string) => void;
  onClearFavorites: () => void;
}

/**
 * FavoritesPage:
 * Displays all recipes marked as favorites by the user.
 * 
 * Features:
 * - Syncs with localStorage via useFavorites hook.
 * - Clean empty state when no recipes are saved with an "Explore Catalog" CTA.
 * - Star toggling directly on favorite cards with instant removal.
 * - "Clear all favorites" button with confirmation.
 */
export const FavoritesPage: FC<FavoritesPageProps> = ({
  recipes,
  favoriteIds,
  onToggleFavorite,
  onClearFavorites
}) => {
  // Filter active recipes that match saved favorite IDs
  const favoriteRecipes = recipes.filter((r) => favoriteIds.includes(r.id));

  return (
    <main style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '1.75rem', color: '#111827' }}>
            ⭐ Saved Favorites
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
            {favoriteRecipes.length === 0
              ? 'Your favorite Level 1 recipes will be kept here.'
              : `You have ${favoriteRecipes.length} favorite ${favoriteRecipes.length === 1 ? 'recipe' : 'recipes'} saved.`}
          </p>
        </div>

        {favoriteRecipes.length > 0 && (
          <button
            type="button"
            onClick={onClearFavorites}
            style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Content: Grid or Empty State */}
      {favoriteRecipes.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          backgroundColor: '#fafafa',
          borderRadius: '12px',
          border: '1.5px dashed #d1d5db',
          marginTop: '1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⭐</div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
            No favorites yet
          </h2>
          <p style={{
            maxWidth: '420px',
            margin: '0 auto 1.5rem auto',
            color: '#6b7280',
            fontSize: '0.95rem',
            lineHeight: 1.5
          }}>
            Browse the recipe catalog and click the star icon (★) on any dish you'd like to save for easy access.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#e65100',
              color: '#ffffff',
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 2px 6px rgba(230, 81, 0, 0.25)'
            }}
          >
            Explore Recipes
          </Link>
        </div>
      )}
    </main>
  );
};
