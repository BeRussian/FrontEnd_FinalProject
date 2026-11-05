import { useState, useEffect, useCallback } from 'react';
import { toggleFavoriteId } from '../utils/recipeUtils';

const STORAGE_KEY = 'easybite_favorites';

/**
 * Custom Hook: useFavorites
 * 
 * Manages the user's favorited recipe IDs with automatic synchronization
 * to localStorage.
 * 
 * Key Features:
 * - Lazy initialization from localStorage so it runs only once on mount.
 * - Error-safe: gracefully catches JSON parse errors or restricted localStorage.
 * - Real-time sync: persists changes to localStorage whenever favoriteIds updates.
 * - Simple API: favoriteIds, toggleFavorite, isFavorite, clearFavorites.
 */
export const useFavorites = () => {
  // Lazy state initialization to read from localStorage without blocking renders
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
    return [];
  });

  // Feedback toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, [favoriteIds]);

  // Dismiss toast automatically after 2.5 seconds
  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  /**
   * Toggles a recipe in or out of favorites and triggers a feedback notification
   */
  const toggleFavorite = useCallback((recipeId: string, recipeTitle?: string): boolean => {
    if (!recipeId) return false;

    const willBeFavorite = !favoriteIds.includes(recipeId);

    setFavoriteIds((prev) => toggleFavoriteId(prev, recipeId));

    const titlePrefix = recipeTitle ? `"${recipeTitle}"` : 'Recipe';
    if (willBeFavorite) {
      setToastMessage(`⭐ ${titlePrefix} added to favorites!`);
    } else {
      setToastMessage(`☆ ${titlePrefix} removed from favorites`);
    }

    return willBeFavorite;
  }, [favoriteIds]);

  /**
   * Helper to quickly check if a recipe is favorited
   */
  const isFavorite = useCallback(
    (recipeId: string): boolean => {
      return favoriteIds.includes(recipeId);
    },
    [favoriteIds]
  );

  /**
   * Clears all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
    setToastMessage('Cleared all favorites');
  }, []);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    toastMessage,
    dismissToast: () => setToastMessage(null)
  };
};
