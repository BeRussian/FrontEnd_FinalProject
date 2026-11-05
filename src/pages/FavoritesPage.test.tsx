import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FavoritesPage } from './FavoritesPage';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Component Test Suite for FavoritesPage
 * 
 * Verifies rendering of favorites grid, empty state, and removal interactions.
 */
describe('FavoritesPage Component', () => {
  it('renders a friendly empty state when no recipes are favorited', () => {
    render(
      <BrowserRouter>
        <FavoritesPage
          recipes={mockRecipes}
          favoriteIds={[]}
          onToggleFavorite={vi.fn()}
          onClearFavorites={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore recipes/i })).toBeInTheDocument();
  });

  it('renders favorited recipes in grid when favoriteIds are present', () => {
    const favoritedRecipe = mockRecipes[0];

    render(
      <BrowserRouter>
        <FavoritesPage
          recipes={mockRecipes}
          favoriteIds={[favoritedRecipe.id]}
          onToggleFavorite={vi.fn()}
          onClearFavorites={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(favoritedRecipe.title)).toBeInTheDocument();
    expect(screen.getByText(/you have 1 favorite recipe saved/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
  });

  it('calls onClearFavorites when "Clear all" button is clicked', () => {
    const handleClear = vi.fn();

    render(
      <BrowserRouter>
        <FavoritesPage
          recipes={mockRecipes}
          favoriteIds={[mockRecipes[0].id, mockRecipes[1].id]}
          onToggleFavorite={vi.fn()}
          onClearFavorites={handleClear}
        />
      </BrowserRouter>
    );

    const clearBtn = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearBtn);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});

