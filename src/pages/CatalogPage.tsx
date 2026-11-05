import { useState, useMemo, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { RecipeCard } from '../components/RecipeCard';
import { StatusView } from '../components/StatusView';
import { SearchBar } from '../components/SearchBar';
import { filterRecipes } from '../utils/recipeUtils';

interface CatalogPageProps {
  recipes: Recipe[];
  isLoading: boolean;
  errorMessage: string | null;
  isUsingFallback: boolean;
  onRetry: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (recipeId: string, recipeTitle: string) => void;
}

/**
 * CatalogPage (Split-View Master-Detail View):
 * 
 * Displays:
 * - Left Pane (Master Sidebar):
 *   - Level 1 Header
 *   - Real-time SearchBar (searches title, ingredients & filters by category)
 *   - Fallback warning banner (when API fails)
 *   - Loading state indicator
 *   - Scrollable list of RecipeCards with interactive favorite stars or Empty State
 * - Right Pane (Detail Canvas):
 *   - High-detail recipe view rendered via <Outlet />.
 */
export const CatalogPage: FC<CatalogPageProps> = ({
  recipes,
  isLoading,
  errorMessage,
  isUsingFallback,
  onRetry,
  isFavorite,
  onToggleFavorite
}) => {
  // Real-time search & filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive unique categories from active recipe list
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    categorySet.add('All');
    recipes.forEach((r) => {
      if (r.category && r.category.trim()) {
        categorySet.add(r.category.trim());
      }
    });
    return Array.from(categorySet);
  }, [recipes]);

  // Real-time filtered recipe list based on query & category
  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, searchQuery, selectedCategory);
  }, [recipes, searchQuery, selectedCategory]);

  return (
    <div className="catalog-split-container">
      {/* 1. Left Column: Scrollable Recipe List (Master Sidebar) */}
      <aside className="catalog-sidebar">
        {/* Sidebar Header */}
        <div style={{ marginBottom: '0.85rem' }}>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: '#1a1a1a' }}>
            🍳 Level 1 Recipes
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#666666' }}>
            {isLoading
              ? 'Loading live dishes...'
              : `${recipes.length} simple meals ready to cook`}
          </span>
        </div>

        {/* Real-time Search & Filter Component */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          totalCount={recipes.length}
          filteredCount={filteredRecipes.length}
        />

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
        ) : filteredRecipes.length > 0 ? (
          <div style={{ flex: 1 }}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty State when search/category filter yields 0 matches */
          <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px dashed #d1d5db',
            marginTop: '0.5rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', color: '#1a1a1a' }}>
              No recipes found
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#666666', lineHeight: 1.4 }}>
              {searchQuery.trim()
                ? `No meals matching "${searchQuery}"`
                : 'No meals found in this category'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              style={{
                backgroundColor: '#e65100',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </aside>

      {/* 2. Right Column: Detailed View Pane */}
      <section className="catalog-detail-pane">
        <Outlet />
      </section>
    </div>
  );
};
