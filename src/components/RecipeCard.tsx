import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import type { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard component:
 * Represents a single recipe item in the scrollable sidebar list.
 * 
 * Features:
 * - Uses NavLink to highlight the card when it matches the current URL route.
 * - Displays image thumbnail, title, prep time, and category pill.
 */
export const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
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
        transition: 'all 0.15s ease-in-out'
      })}
    >
      {/* Thumbnail image */}
      <img
        src={recipe.image}
        alt={recipe.title}
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
    </NavLink>
  );
};
