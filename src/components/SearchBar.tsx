import type { FC } from 'react';

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
}

/**
 * SearchBar Component (EasyBite):
 * 
 * Features:
 * - Real-time controlled text input that filters on every single keystroke.
 * - Searches recipe title, ingredients, and summary.
 * - Instant "✕" clear button when search is active.
 * - Interactive category pill buttons with active orange state.
 * - Live results counter: "Showing X of Y recipes".
 */
export const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  filteredCount
}) => {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* 1. Real-time Search Input with Icon & Clear Button */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        {/* Search Icon */}
        <span
          style={{
            position: 'absolute',
            left: '0.75rem',
            fontSize: '1rem',
            color: '#888',
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        >
          🔍
        </span>

        {/* Controlled Input: updates parent state on every keystroke */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title or ingredient (e.g., egg, cheese)..."
          aria-label="Search recipes"
          style={{
            width: '100%',
            padding: '0.65rem 2rem 0.65rem 2.25rem',
            fontSize: '0.9rem',
            borderRadius: '8px',
            border: '1.5px solid #d1d5db',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#e65100';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(230, 81, 0, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Clear Button (appears only when user typed something) */}
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
            title="Clear search"
            style={{
              position: 'absolute',
              right: '0.5rem',
              background: '#e5e7eb',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: '#4b5563',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Category Filter Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.35rem',
        marginBottom: '0.6rem'
      }}>
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              style={{
                border: isActive ? '1px solid #e65100' : '1px solid #e0e0e0',
                backgroundColor: isActive ? '#e65100' : '#ffffff',
                color: isActive ? '#ffffff' : '#4a4a4a',
                padding: '0.3rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Live Results Counter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: '#6b7280',
        padding: '0 0.2rem'
      }}>
        <span>
          Showing <strong>{filteredCount}</strong> of {totalCount} recipes
        </span>

        {/* Quick Reset All link if filters active */}
        {(searchQuery.trim() !== '' || selectedCategory.toLowerCase() !== 'all') && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#e65100',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
};
