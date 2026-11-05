import type { FC } from 'react';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  favoritesCount?: number;
}

/**
 * Navbar component:
 * Provides client-side navigation between views using NavLink.
 * 
 * Why NavLink instead of plain <a> tags?
 * - Standard <a> tags trigger a full page reload from the server.
 * - NavLink intercepts the click, updates the browser URL via the History API,
 *   and allows React to re-render only the matched route component (SPA).
 */
export const Navbar: FC<NavbarProps> = ({ favoritesCount = 0 }) => {
  const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    marginRight: '1rem',
    color: isActive ? '#e65100' : '#333333',
    fontWeight: isActive ? ('bold' as const) : ('500' as const),
    textDecoration: isActive ? 'underline' : 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem'
  });

  return (
    <header style={{
      borderBottom: '2px solid #eaeaea',
      padding: '0.85rem 1.5rem',
      backgroundColor: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        <NavLink to="/" style={{ textDecoration: 'none', color: '#e65100' }}>
          🍳 EasyBite
        </NavLink>
      </div>

      <nav aria-label="Main Navigation">
        <NavLink to="/" style={getLinkStyle} end>
          Catalog
        </NavLink>
        <NavLink to="/favorites" style={getLinkStyle}>
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span style={{
              backgroundColor: '#e65100',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              {favoritesCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/random" style={getLinkStyle}>
          Random
        </NavLink>
        <NavLink to="/shopping-list" style={getLinkStyle}>
          Shopping List
        </NavLink>
      </nav>
    </header>
  );
};
