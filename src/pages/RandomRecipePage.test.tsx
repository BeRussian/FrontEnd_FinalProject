import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RandomRecipePage } from './RandomRecipePage';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Component Test Suite for RandomRecipePage
 * 
 * Verifies random recipe selection, re-roll interaction, and favorite starring.
 */
describe('RandomRecipePage Component', () => {
  it('renders random recipe generator with roll button and a selected recipe', () => {
    render(
      <BrowserRouter>
        <RandomRecipePage
          recipes={mockRecipes}
          isFavorite={vi.fn()}
          onToggleFavorite={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /what should i make/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /roll another recipe/i })).toBeInTheDocument();

    // One of the mock recipe titles must be displayed
    const hasRecipeRendered = mockRecipes.some((r) =>
      screen.queryByText(r.title) !== null
    );
    expect(hasRecipeRendered).toBe(true);
  });

  it('allows user to click "Roll Another Recipe" to select a new dish', () => {
    render(
      <BrowserRouter>
        <RandomRecipePage
          recipes={mockRecipes}
          isFavorite={vi.fn()}
          onToggleFavorite={vi.fn()}
        />
      </BrowserRouter>
    );

    const rollBtn = screen.getByRole('button', { name: /roll another recipe/i });
    expect(rollBtn).toBeInTheDocument();

    // Click roll multiple times to confirm no errors occur
    fireEvent.click(rollBtn);
    fireEvent.click(rollBtn);

    const hasRecipeRendered = mockRecipes.some((r) =>
      screen.queryByText(r.title) !== null
    );
    expect(hasRecipeRendered).toBe(true);
  });

  it('triggers onToggleFavorite when starring the random recipe', () => {
    const handleToggle = vi.fn();

    render(
      <BrowserRouter>
        <RandomRecipePage
          recipes={mockRecipes}
          isFavorite={() => false}
          onToggleFavorite={handleToggle}
        />
      </BrowserRouter>
    );

    const saveBtn = screen.getByRole('button', { name: /add .* to favorites/i });
    fireEvent.click(saveBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('shows graceful fallback when recipes list is empty', () => {
    render(
      <BrowserRouter>
        <RandomRecipePage
          recipes={[]}
          isFavorite={vi.fn()}
          onToggleFavorite={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading recipes/i)).toBeInTheDocument();
  });
});
