import { useState, useEffect, useMemo, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types/recipe';

const STORAGE_KEY = 'easybite_shopping_list';

export interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
  source?: string;
}

export interface ShoppingListPageProps {
  recipes: Recipe[];
  favoriteIds: string[];
}

/**
 * ShoppingListPage (Interactive To-Do Checklist):
 * 
 * Features:
 * - Automatically populates grocery items from user's favorited recipes on first load.
 * - Interactive checkboxes to mark items as purchased/completed with strikethrough.
 * - Discard (delete) button per item.
 * - Custom item input: allows adding any grocery item (e.g., "Paper towels", "Milk").
 * - Progress indicator: "X of Y items in basket" with visual progress bar.
 * - "Clear completed" & "Sync from Favorites" action buttons.
 * - Full localStorage persistence.
 */
export const ShoppingListPage: FC<ShoppingListPageProps> = ({
  recipes,
  favoriteIds
}) => {
  // Find all recipes currently marked as favorites
  const favoriteRecipes = useMemo(() => {
    return recipes.filter((r) => favoriteIds.includes(r.id));
  }, [recipes, favoriteIds]);

  // Load persisted items or initialize from favorites on first visit
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse shopping list from localStorage:', e);
    }

    // Default initialization from favorites if no storage exists yet
    const initialItems: ShoppingListItem[] = [];
    const seenNames = new Set<string>();

    favoriteRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const trimmed = ing.trim();
        const lower = trimmed.toLowerCase();
        if (trimmed && !seenNames.has(lower)) {
          seenNames.add(lower);
          initialItems.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: trimmed,
            completed: false,
            source: recipe.title
          });
        }
      });
    });

    return initialItems;
  });

  // State for new custom item input
  const [newItemText, setNewItemText] = useState<string>('');

  // Persist items to localStorage whenever list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save shopping list to localStorage:', e);
    }
  }, [items]);

  // Toggle item completed status
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Discard a single item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add custom grocery item
  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    const newItem: ShoppingListItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmed,
      completed: false,
      source: 'Custom Item'
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemText('');
  };

  // Pull fresh ingredients from favorites and merge into list
  const handleSyncFromFavorites = () => {
    const existingNames = new Set(items.map((i) => i.name.toLowerCase()));
    const newItems: ShoppingListItem[] = [];

    favoriteRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const trimmed = ing.trim();
        const lower = trimmed.toLowerCase();
        if (trimmed && !existingNames.has(lower)) {
          existingNames.add(lower);
          newItems.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: trimmed,
            completed: false,
            source: recipe.title
          });
        }
      });
    });

    setItems((prev) => [...prev, ...newItems]);
  };

  // Clear checked/completed items
  const handleClearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.completed));
  };

  // Clear all items
  const handleClearAll = () => {
    setItems([]);
  };

  // Progress metrics
  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <main style={{
      maxWidth: '780px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 0.35rem 0',
            fontSize: '1.75rem',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🛒</span> Grocery Shopping List
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.92rem' }}>
            {favoriteRecipes.length > 0
              ? `Aggregated ingredients from ${favoriteRecipes.length} favorite ${favoriteRecipes.length === 1 ? 'recipe' : 'recipes'}.`
              : 'Add ingredients from favorites or type your own items below.'}
          </p>
        </div>

        {/* Sync & Reset Tools */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {favoriteRecipes.length > 0 && (
            <button
              type="button"
              onClick={handleSyncFromFavorites}
              style={{
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔄 Sync from Favorites
            </button>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleClearCompleted}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear completed ({completedCount})
            </button>
          )}

          {totalCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Counters */}
      {totalCount > 0 && (
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.88rem',
            marginBottom: '0.5rem',
            color: '#374151'
          }}>
            <span>
              <strong>{completedCount}</strong> of <strong>{totalCount}</strong> items in basket
            </span>
            <span style={{ fontWeight: 700, color: percentage === 100 ? '#16a34a' : '#e65100' }}>
              {percentage}% Complete
            </span>
          </div>

          {/* Bar track */}
          <div style={{
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: percentage === 100 ? '#16a34a' : '#e65100',
              transition: 'width 0.3s ease-in-out'
            }} />
          </div>
        </div>
      )}

      {/* Add Custom Item Form */}
      <form
        onSubmit={handleAddItem}
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}
      >
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom item (e.g. Olive oil, Paper towels)..."
          aria-label="Add grocery item"
          style={{
            flex: 1,
            padding: '0.7rem 1rem',
            fontSize: '0.9rem',
            borderRadius: '8px',
            border: '1.5px solid #d1d5db',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#e65100';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        />
        <button
          type="submit"
          disabled={!newItemText.trim()}
          style={{
            backgroundColor: newItemText.trim() ? '#e65100' : '#9ca3af',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: newItemText.trim() ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s'
          }}
        >
          + Add
        </button>
      </form>

      {/* Shopping List Items */}
      {totalCount > 0 ? (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.2rem',
                borderBottom: '1px solid #f3f4f6',
                backgroundColor: item.completed ? '#f9fafb' : '#ffffff',
                transition: 'background-color 0.15s ease'
              }}
            >
              {/* Checkbox and label */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flex: 1,
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleItem(item.id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#e65100',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '0.95rem',
                  color: item.completed ? '#9ca3af' : '#1f2937',
                  textDecoration: item.completed ? 'line-through' : 'none',
                  transition: 'all 0.15s ease'
                }}>
                  {item.name}
                </span>

                {item.source && (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginLeft: '0.25rem'
                  }}>
                    {item.source}
                  </span>
                )}
              </label>

              {/* Discard button */}
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                aria-label={`Discard ${item.name}`}
                title="Discard item"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  lineHeight: 1,
                  transition: 'color 0.15s, background-color 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '3.5rem 1.5rem',
          backgroundColor: '#fafafa',
          borderRadius: '12px',
          border: '1.5px dashed #d1d5db'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛒</div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
            Your shopping list is empty
          </h2>
          <p style={{
            maxWidth: '440px',
            margin: '0 auto 1.5rem auto',
            color: '#6b7280',
            fontSize: '0.92rem',
            lineHeight: 1.5
          }}>
            {favoriteRecipes.length === 0
              ? 'Star recipes in the catalog to automatically collect their ingredients here, or type custom items above.'
              : 'All items have been cleared. Click "Sync from Favorites" above to restore your ingredients.'}
          </p>
          {favoriteRecipes.length === 0 && (
            <Link
              to="/"
              style={{
                display: 'inline-block',
                backgroundColor: '#e65100',
                color: '#ffffff',
                padding: '0.65rem 1.4rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Explore Recipes
            </Link>
          )}
        </div>
      )}
    </main>
  );
};
