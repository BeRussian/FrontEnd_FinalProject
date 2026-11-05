import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecipeCard } from './RecipeCard';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Component Test Suite for RecipeCard
 * 
 * Verifies rendering, fallback image, and favorite star click interactions.
 */
describe('RecipeCard Component', () => {
  const sampleRecipe = mockRecipes[0];

  it('renders recipe title, category, and prep time correctly', () => {
    render(
      <BrowserRouter>
        <RecipeCard recipe={sampleRecipe} />
      </BrowserRouter>
    );

    expect(screen.getByText(sampleRecipe.title)).toBeInTheDocument();
    expect(screen.getByText(sampleRecipe.category)).toBeInTheDocument();
    expect(screen.getByText(`⏱️ ${sampleRecipe.prepTime}`)).toBeInTheDocument();
  });

  it('renders an empty star (☆) when recipe is not favorited', () => {
    render(
      <BrowserRouter>
        <RecipeCard
          recipe={sampleRecipe}
          isFavorite={false}
          onToggleFavorite={vi.fn()}
        />
      </BrowserRouter>
    );

    const starBtn = screen.getByRole('button', {
      name: new RegExp(`Add ${sampleRecipe.title} to favorites`, 'i')
    });
    expect(starBtn).toBeInTheDocument();
    expect(starBtn).toHaveTextContent('☆');
  });

  it('renders a golden filled star (★) when recipe is favorited', () => {
    render(
      <BrowserRouter>
        <RecipeCard
          recipe={sampleRecipe}
          isFavorite={true}
          onToggleFavorite={vi.fn()}
        />
      </BrowserRouter>
    );

    const starBtn = screen.getByRole('button', {
      name: new RegExp(`Remove ${sampleRecipe.title} from favorites`, 'i')
    });
    expect(starBtn).toBeInTheDocument();
    expect(starBtn).toHaveTextContent('★');
  });

  it('invokes onToggleFavorite with recipe id and title when star is clicked', () => {
    const handleToggle = vi.fn();

    render(
      <BrowserRouter>
        <RecipeCard
          recipe={sampleRecipe}
          isFavorite={false}
          onToggleFavorite={handleToggle}
        />
      </BrowserRouter>
    );

    const starBtn = screen.getByRole('button', {
      name: new RegExp(`Add ${sampleRecipe.title} to favorites`, 'i')
    });
    fireEvent.click(starBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(sampleRecipe.id, sampleRecipe.title);
  });
});

