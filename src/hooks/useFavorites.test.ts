import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from './useFavorites';

/**
 * Unit / Integration Test Suite for useFavorites Hook
 * 
 * Tests localStorage persistence, toggle mechanics, and toast feedback.
 */
describe('useFavorites Custom Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with an empty array when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.isFavorite('1')).toBe(false);
  });

  it('initializes with pre-existing favorites from localStorage', () => {
    localStorage.setItem('easybite_favorites', JSON.stringify(['101', '102']));

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual(['101', '102']);
    expect(result.current.isFavorite('101')).toBe(true);
    expect(result.current.isFavorite('999')).toBe(false);
  });

  it('gracefully handles corrupted JSON in localStorage without throwing', () => {
    localStorage.setItem('easybite_favorites', 'INVALID_NOT_JSON{{');

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual([]);
  });

  it('adds a recipe to favorites, updates localStorage and sets toast message', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      const added = result.current.toggleFavorite('52772', 'Teriyaki Chicken');
      expect(added).toBe(true);
    });

    expect(result.current.favoriteIds).toContain('52772');
    expect(result.current.isFavorite('52772')).toBe(true);
    expect(result.current.toastMessage).toContain('Teriyaki Chicken');
    expect(result.current.toastMessage).toContain('added to favorites');

    // Verify localStorage was updated
    const saved = JSON.parse(localStorage.getItem('easybite_favorites') || '[]');
    expect(saved).toContain('52772');
  });

  it('removes an existing recipe from favorites and updates toast', () => {
    localStorage.setItem('easybite_favorites', JSON.stringify(['52772']));

    const { result } = renderHook(() => useFavorites());

    act(() => {
      const added = result.current.toggleFavorite('52772', 'Teriyaki Chicken');
      expect(added).toBe(false);
    });

    expect(result.current.favoriteIds).not.toContain('52772');
    expect(result.current.isFavorite('52772')).toBe(false);
    expect(result.current.toastMessage).toContain('removed from favorites');

    // Verify localStorage was updated
    const saved = JSON.parse(localStorage.getItem('easybite_favorites') || '[]');
    expect(saved).not.toContain('52772');
  });

  it('clears all favorites when clearFavorites is called', () => {
    localStorage.setItem('easybite_favorites', JSON.stringify(['1', '2', '3']));

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds.length).toBe(3);

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favoriteIds).toEqual([]);
    const saved = JSON.parse(localStorage.getItem('easybite_favorites') || '[]');
    expect(saved).toEqual([]);
  });
});

