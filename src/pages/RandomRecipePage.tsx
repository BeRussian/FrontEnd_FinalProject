import type { FC } from 'react';

/**
 * RandomRecipePage:
 * Instant decision maker for beginners ("What should I make?").
 */
export const RandomRecipePage: FC = () => {
  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🎲 What Should I Make?</h1>
      <p>This is the Random Recipe Generator. Click a button to get an instant meal recommendation.</p>
    </main>
  );
};

