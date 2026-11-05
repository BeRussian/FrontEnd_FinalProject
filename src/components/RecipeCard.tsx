import type { FC, MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { DEFAULT_RECIPE_IMAGE } from '../constants/recipeConstants';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string, recipeTitle: string) => void;
}

/**
 * RecipeCard component:
 * Represents a single recipe item in the scrollable sidebar list or favorites grid.
 * 
 * Features:
 * - Uses NavLink to highlight the card when it matches the current URL route.
 * - Displays image thumbnail, title, prep time, and category pill.
 * - Interactive star button (★/☆) to add/remove from favorites with stopPropagation.
 */
export const RecipeCard: FC<RecipeCardProps> = ({
  recipe,
  isFavorite = false,
  onToggleFavorite
}) => {
  const handleStarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id, recipe.title);
    }
  };

  return (
    <NavLink
      to={`/recipes/${recipe.id}`}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem',
        marginBottom: '0.75rem',
        borderRadius: '10px',
        textDecoration: 'none',
        color: '#222222',
        backgroundColor: isActive ? '#fff3e0' : '#ffffff',
        border: isActive ? '2px solid #e65100' : '1px solid #e0e0e0',
        boxShadow: isActive ? '0 2px 8px rgba(230, 81, 0, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.15s ease-in-out',
        position: 'relative'
      })}
    >
      {/* Thumbnail image */}
      <img
        src={recipe.image || DEFAULT_RECIPE_IMAGE}
        alt={recipe.title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_RECIPE_IMAGE;
        }}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '8px',
          objectFit: 'cover',
          flexShrink: 0
        }}
      />

      {/* Info column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          margin: '0 0 0.35rem 0',
          fontSize: '0.95rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {recipe.title}
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: '#666666' }}>
          <span style={{
            backgroundColor: '#f0f0f0',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 500
          }}>
            {recipe.category}
          </span>
          <span>⏱️ {recipe.prepTime}</span>
        </div>
      </div>

      {/* Star button */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={handleStarClick}
          aria-label={isFavorite ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.35rem',
            lineHeight: 1,
            color: isFavorite ? '#f59e0b' : '#9ca3af',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease, color 0.15s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </NavLink>
  );
};
