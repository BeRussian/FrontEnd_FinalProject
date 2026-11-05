import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { RecipeCard } from '../components/RecipeCard';
import { StatusView } from '../components/StatusView';

interface CatalogPageProps {
  recipes: Recipe[];
  isLoading: boolean;
  errorMessage: string | null;
  isUsingFallback: boolean;
  onRetry: () => void;
}

/**
 * CatalogPage (Split-View Master-Detail View):
 * 
 * Displays:
 * - Left Pane: Sidebar with loading spinner, fallback warning banner, and scrollable list of recipes.
 * - Right Pane: High-detail recipe canvas rendered via <Outlet />.
 */
export const CatalogPage: FC<CatalogPageProps> = ({
  recipes,
  isLoading,
  errorMessage,
  isUsingFallback,
  onRetry
}) => {
  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 65px)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 1. Left Column: Scrollable Recipe List (Master Sidebar) */}
      <aside style={{
        width: '360px',
        minWidth: '320px',
        maxWidth: '420px',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: '#1a1a1a' }}>
            🍳 Level 1 Recipes
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#666666' }}>
            {isLoading
              ? 'Loading live dishes...'
              : `${recipes.length} simple recipes available`}
          </span>
        </div>

        {/* Fallback warning banner when API fails */}
        {isUsingFallback && (
          <StatusView
            type="error"
            message={errorMessage || 'Live API unavailable. Showing local recipes.'}
            onRetry={onRetry}
          />
        )}

        {/* Loading state indicator */}
        {isLoading ? (
          <StatusView type="loading" message="Cooking up recipes from TheMealDB..." />
        ) : (
          <div style={{ flex: 1 }}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </aside>

      {/* 2. Right Column: Detailed View Pane */}
      <section style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem 2.5rem',
        backgroundColor: '#ffffff'
      }}>
        <Outlet />
      </section>
    </div>
  );
};
