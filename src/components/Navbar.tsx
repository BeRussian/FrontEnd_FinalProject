import type { FC } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Navbar component:
 * Provides client-side navigation between views using NavLink.
 * 
 * Why NavLink instead of plain <a> tags?
 * - Standard <a> tags trigger a full page reload from the server.
 * - NavLink intercepts the click, updates the browser URL via the History API,
 *   and allows React to re-render only the matched route component (SPA).
 */
export const Navbar: FC = () => {
  const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    marginRight: '1rem',
    color: isActive ? '#e65100' : '#333333',
    fontWeight: isActive ? ('bold' as const) : ('normal' as const),
    textDecoration: isActive ? 'underline' : 'none'
  });

  return (
    <header style={{
      borderBottom: '2px solid #eaeaea',
      padding: '1rem 1.5rem',
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
          Favorites
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
