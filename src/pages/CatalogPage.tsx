import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';
import { RecipeCard } from '../components/RecipeCard';

/**
 * CatalogPage (Split-View Master-Detail Layout):
 * 
 * Layout Architecture:
 * - Left Pane (Master): Scrollable sidebar containing RecipeCard instances.
 * - Right Pane (Detail): Flexible main content area rendering the detailed Recipe view via <Outlet />.
 */
export const CatalogPage: FC = () => {
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
        minWidth: '300px',
        maxWidth: '400px',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', color: '#1a1a1a' }}>
            🍳 Level 1 Recipes
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#666666' }}>
            {mockRecipes.length} simple meals ready to cook
          </span>
        </div>

        {/* Scrollable list of RecipeCard component instances */}
        <div style={{ flex: 1 }}>
          {mockRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </aside>

      {/* 2. Right Column: Detailed View Pane (Detail Canvas) */}
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
