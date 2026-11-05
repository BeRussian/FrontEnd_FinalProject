import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';

/**
 * RecipeDetailPage (Detail View):
 * Renders the full details of a selected recipe on the main pane.
 * 
 * - Extracts `id` parameter from URL via `useParams()`.
 * - Displays high-resolution image, ingredients checklist, and step-by-step instructions.
 */
export const RecipeDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  // If no ID is specified, default to the first recipe or show placeholder
  const activeId = id || mockRecipes[0]?.id;
  const recipe = mockRecipes.find((item) => item.id === activeId);

  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#666666' }}>
        <h2>Recipe Not Found</h2>
        <p>Could not locate recipe #{id}. Please select a recipe from the list.</p>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Header section with image and title */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        marginBottom: '1.5rem',
        backgroundColor: '#000000'
      }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: '100%',
            height: '320px',
            objectFit: 'cover',
            display: 'block',
            opacity: 0.95
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          padding: '2rem 1.5rem 1rem 1.5rem',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              backgroundColor: '#e65100',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '14px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {recipe.difficulty}
            </span>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 10px',
              borderRadius: '14px',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              {recipe.category}
            </span>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 10px',
              borderRadius: '14px',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              ⏱️ {recipe.prepTime}
            </span>
          </div>

          <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 700 }}>
            {recipe.title}
          </h1>
        </div>
      </div>

      {/* Short description */}
      <p style={{
        fontSize: '1.05rem',
        lineHeight: 1.6,
        color: '#444444',
        marginBottom: '2rem',
        fontStyle: 'italic',
        backgroundColor: '#fafafa',
        padding: '1rem',
        borderRadius: '8px',
        borderLeft: '4px solid #e65100'
      }}>
        "{recipe.description}"
      </p>

      {/* Two-column content: Ingredients & Instructions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Ingredients section */}
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1a1a1a' }}>
            🛒 Ingredients
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, color: '#333333' }}>
            {recipe.ingredients.map((item, index) => (
              <li key={index} style={{ marginBottom: '0.25rem' }}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Step-by-Step Instructions */}
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1a1a1a' }}>
            👩‍🍳 Step-by-Step Directions
          </h2>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, color: '#333333' }}>
            {recipe.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: '0.65rem' }}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};
