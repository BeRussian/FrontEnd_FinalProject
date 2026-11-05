import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

/**
 * Component / Integration Test Suite for SearchBar
 * 
 * Tests user interactions: typing, clearing, category selection,
 * and reactive UI updates.
 */
describe('SearchBar Component (User Interaction & Reactive UI)', () => {
  const dummyCategories = ['All', 'Breakfast', 'Pasta', 'Dessert'];

  it('renders search input with correct placeholder and icon', () => {
    render(
      <SearchBar
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={25}
      />
    );

    const input = screen.getByRole('textbox', { name: /search recipes/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', expect.stringContaining('Search'));
  });

  it('fires onSearchChange on every keystroke when typing', () => {
    const handleSearchChange = vi.fn();

    render(
      <SearchBar
        searchQuery=""
        onSearchChange={handleSearchChange}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={25}
      />
    );

    const input = screen.getByRole('textbox', { name: /search recipes/i });
    fireEvent.change(input, { target: { value: 'cheese' } });

    expect(handleSearchChange).toHaveBeenCalledTimes(1);
    expect(handleSearchChange).toHaveBeenCalledWith('cheese');
  });

  it('shows the clear button (✕) only when search query is non-empty', () => {
    const { rerender } = render(
      <SearchBar
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={25}
      />
    );

    // When empty, clear button should not be in DOM
    expect(screen.queryByRole('button', { name: /clear search query/i })).not.toBeInTheDocument();

    // Rerender with search text
    rerender(
      <SearchBar
        searchQuery="egg"
        onSearchChange={vi.fn()}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={5}
      />
    );

    // Now clear button must appear
    const clearButton = screen.getByRole('button', { name: /clear search query/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('clears search input when clear button (✕) is clicked', () => {
    const handleSearchChange = vi.fn();

    render(
      <SearchBar
        searchQuery="pasta"
        onSearchChange={handleSearchChange}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={3}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear search query/i });
    fireEvent.click(clearButton);

    expect(handleSearchChange).toHaveBeenCalledWith('');
  });

  it('renders all category pills and calls onCategoryChange when clicked', () => {
    const handleCategoryChange = vi.fn();

    render(
      <SearchBar
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedCategory="All"
        onCategoryChange={handleCategoryChange}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={25}
      />
    );

    dummyCategories.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument();
    });

    // Click on "Pasta" category
    const pastaButton = screen.getByRole('button', { name: 'Pasta' });
    fireEvent.click(pastaButton);

    expect(handleCategoryChange).toHaveBeenCalledWith('Pasta');
  });

  it('displays accurate result counts: "Showing X of Y recipes"', () => {
    render(
      <SearchBar
        searchQuery="cheese"
        onSearchChange={vi.fn()}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={4}
      />
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 4 of 25 recipes');
  });

  it('resets both search query and category when clicking "Reset filters"', () => {
    const handleSearchChange = vi.fn();
    const handleCategoryChange = vi.fn();

    render(
      <SearchBar
        searchQuery="toast"
        onSearchChange={handleSearchChange}
        selectedCategory="Breakfast"
        onCategoryChange={handleCategoryChange}
        categories={dummyCategories}
        totalCount={25}
        filteredCount={1}
      />
    );

    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleSearchChange).toHaveBeenCalledWith('');
    expect(handleCategoryChange).toHaveBeenCalledWith('All');
  });
});

