import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { getRandomRecipe } from '../utils/recipeUtils';
import { DEFAULT_RECIPE_IMAGE } from '../constants/recipeConstants';

export interface RandomRecipePageProps {
  recipes: Recipe[];
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string, title: string) => void;
}

/**
 * RandomRecipePage (Random Generator View):
 * 
 * Instant decision maker for beginners who don't know what to cook.
 * Randomly picks an easy Level 1 recipe from the catalog with a single click.
 */
export const RandomRecipePage: FC<RandomRecipePageProps> = ({
  recipes,
  isFavorite,
  onToggleFavorite
}) => {
  // Current randomly selected recipe
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(() => {
    return getRandomRecipe(recipes);
  });

  // Ensure a recipe is selected once recipes are loaded from the API
  useEffect(() => {
    if (!currentRecipe && recipes.length > 0) {
      setCurrentRecipe(getRandomRecipe(recipes));
    }
  }, [recipes, currentRecipe]);

  /**
   * Randomly chooses another recipe, avoiding repeating the same recipe
   * consecutively if more than one recipe exists.
   */
  const handleRollAnother = () => {
    if (!recipes || recipes.length === 0) return;

    const availablePool =
      recipes.length > 1 && currentRecipe
        ? recipes.filter((r) => r.id !== currentRecipe.id)
        : recipes;

    const nextRecipe = getRandomRecipe(availablePool);
    setCurrentRecipe(nextRecipe);
  };

  if (!recipes || recipes.length === 0) {
    return (
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h2>Loading recipes...</h2>
        <p style={{ color: '#666666' }}>Preparing random dishes for you.</p>
      </main>
    );
  }

  const isFav = currentRecipe && isFavorite ? isFavorite(currentRecipe.id) : false;

  return (
    <main style={{
      maxWidth: '820px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Generator Banner & Controls */}
      <div style={{
        backgroundColor: '#fff7ed',
        border: '1.5px solid #fed7aa',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(230, 81, 0, 0.06)'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 0.35rem 0',
            fontSize: '1.6rem',
            color: '#9a3412',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🎲</span> What Should I Make?
          </h1>
          <p style={{ margin: 0, color: '#7c2d12', fontSize: '0.92rem' }}>
            Can't decide? Let EasyBite pick a simple Level 1 dish for you!
          </p>
        </div>

        <button
          type="button"
          onClick={handleRollAnother}
          style={{
            backgroundColor: '#e65100',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.75rem 1.4rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(230, 81, 0, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.15s ease, background-color 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#cf4700';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e65100';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>🎲</span> Roll Another Recipe
        </button>
      </div>

      {/* Render Selected Recipe */}
      {currentRecipe && (
        <article style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          {/* Hero Image & Overlay */}
          <div style={{
            position: 'relative',
            height: '320px',
            backgroundColor: '#000000'
          }}>
            <img
              src={currentRecipe.image || DEFAULT_RECIPE_IMAGE}
              alt={currentRecipe.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_RECIPE_IMAGE;
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.95
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
              padding: '2rem 1.5rem 1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    backgroundColor: '#e65100',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {currentRecipe.difficulty}
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {currentRecipe.category}
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    ⏱️ {currentRecipe.prepTime}
                  </span>
                </div>

                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
                  {currentRecipe.title}
                </h2>
              </div>

              {/* Action Buttons: Favorite & View in Catalog */}
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(currentRecipe.id, currentRecipe.title)}
                    aria-label={isFav ? `Remove ${currentRecipe.title} from favorites` : `Add ${currentRecipe.title} to favorites`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: isFav ? '#fef3c7' : 'rgba(255, 255, 255, 0.95)',
                      color: isFav ? '#b45309' : '#1f2937',
                      border: isFav ? '2px solid #f59e0b' : '2px solid transparent',
                      borderRadius: '8px',
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', color: isFav ? '#f59e0b' : '#6b7280' }}>
                      {isFav ? '★' : '☆'}
                    </span>
                    <span>{isFav ? 'Saved' : 'Save'}</span>
                  </button>
                )}

                <Link
                  to={`/recipes/${currentRecipe.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.9rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  View in Catalog →
                </Link>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '1.75rem' }}>
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#374151',
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: '4px solid #e65100',
              fontStyle: 'italic',
              margin: '0 0 1.5rem 0'
            }}>
              "{currentRecipe.description}"
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {/* Ingredients */}
              <section>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.15rem', color: '#111827' }}>
                  🛒 Ingredients ({currentRecipe.ingredients.length})
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.7, color: '#4b5563' }}>
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{ing}</li>
                  ))}
                </ul>
              </section>

              {/* Instructions */}
              <section>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.15rem', color: '#111827' }}>
                  👩‍🍳 Instructions
                </h3>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.7, color: '#4b5563' }}>
                  {currentRecipe.instructions.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{step}</li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </article>
      )}
    </main>
  );
};
