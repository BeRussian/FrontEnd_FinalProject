import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ShoppingListPage } from './ShoppingListPage';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Component Test Suite for ShoppingListPage
 * 
 * Verifies automatic ingredient aggregation from favorites,
 * manual item addition, checking off items, discarding, and clearing.
 */
describe('ShoppingListPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders an empty state when no recipes are favorited and list is empty', () => {
    render(
      <BrowserRouter>
        <ShoppingListPage recipes={mockRecipes} favoriteIds={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText(/your shopping list is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore recipes/i })).toBeInTheDocument();
  });

  it('automatically extracts ingredients from favorited recipes', () => {
    const favoritedRecipe = mockRecipes[0]; // Golden Grilled Cheese

    render(
      <BrowserRouter>
        <ShoppingListPage
          recipes={mockRecipes}
          favoriteIds={[favoritedRecipe.id]}
        />
      </BrowserRouter>
    );

    // Verify ingredients from recipe 0 appear in the list
    expect(screen.getByText('2 slices of bread')).toBeInTheDocument();
    expect(screen.getByText('2 slices of cheddar cheese')).toBeInTheDocument();
    expect(screen.getByText('1 tablespoon of butter')).toBeInTheDocument();
    expect(screen.getByText('A pinch of salt')).toBeInTheDocument();
  });

  it('allows user to toggle an item as completed with strikethrough', () => {
    const favoritedRecipe = mockRecipes[0];

    render(
      <BrowserRouter>
        <ShoppingListPage
          recipes={mockRecipes}
          favoriteIds={[favoritedRecipe.id]}
        />
      </BrowserRouter>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox).not.toBeChecked();

    // Check the first item
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    // Verify progress update: "1 of 4 items in basket"
    expect(screen.getByText(/items in basket/i)).toHaveTextContent('1 of 4 items in basket');
  });

  it('allows user to add a custom grocery item via form submission', () => {
    render(
      <BrowserRouter>
        <ShoppingListPage recipes={mockRecipes} favoriteIds={[]} />
      </BrowserRouter>
    );

    const input = screen.getByRole('textbox', { name: /add grocery item/i });
    const addButton = screen.getByRole('button', { name: /\+ add/i });

    fireEvent.change(input, { target: { value: 'Olive oil extra virgin' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Olive oil extra virgin')).toBeInTheDocument();
  });

  it('allows user to discard (delete) an item from the list', () => {
    const favoritedRecipe = mockRecipes[0];

    render(
      <BrowserRouter>
        <ShoppingListPage
          recipes={mockRecipes}
          favoriteIds={[favoritedRecipe.id]}
        />
      </BrowserRouter>
    );

    const discardBtn = screen.getByRole('button', {
      name: /discard 2 slices of bread/i
    });
    fireEvent.click(discardBtn);

    expect(screen.queryByText('2 slices of bread')).not.toBeInTheDocument();
  });

  it('clears all items when clicking "Clear all" button', () => {
    const favoritedRecipe = mockRecipes[0];

    render(
      <BrowserRouter>
        <ShoppingListPage
          recipes={mockRecipes}
          favoriteIds={[favoritedRecipe.id]}
        />
      </BrowserRouter>
    );

    const clearAllBtn = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearAllBtn);

    expect(screen.getByText(/your shopping list is empty/i)).toBeInTheDocument();
  });
});
