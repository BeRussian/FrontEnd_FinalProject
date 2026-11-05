import type { FC } from 'react';

/**
 * FavoritesPage:
 * Displays saved favorites.
 */
export const FavoritesPage: FC = () => {
  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>❤️ Saved Favorites</h1>
      <p>This is the Favorites page. Your saved recipes will appear here.</p>
    </main>
  );
};

