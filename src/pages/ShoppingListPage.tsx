import type { FC } from 'react';

/**
 * ShoppingListPage:
 * Aggregated ingredients checklist.
 */
export const ShoppingListPage: FC = () => {
  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🛒 Grocery Shopping List</h1>
      <p>This is the Shopping List page. Ingredients from your favorite recipes will be listed here.</p>
    </main>
  );
};

