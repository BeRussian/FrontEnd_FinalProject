import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { RandomRecipePage } from './pages/RandomRecipePage';
import { ShoppingListPage } from './pages/ShoppingListPage';

/**
 * App:
 * Root component configuring React Router for the EasyBite application.
 */
export const App: FC = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>
            {/* Master View: Recipe Catalog */}
            <Route path="/" element={<CatalogPage />} />

            {/* Detail View: Individual Recipe by Dynamic ID */}
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />

            {/* Extra View 1: Saved Favorites */}
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* Extra View 2: Random Recipe Decision Maker */}
            <Route path="/random" element={<RandomRecipePage />} />

            {/* Extra View 3: Shopping List */}
            <Route path="/shopping-list" element={<ShoppingListPage />} />

            {/* Bonus: 404 Not Found fallback route */}
            <Route
              path="*"
              element={
                <main style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
                  <h1>404: Page Not Found</h1>
                  <p>Oops! The recipe page you are looking for does not exist.</p>
                  <Link to="/" style={{ color: '#e65100', fontWeight: 'bold' }}>
                    Return to Home Catalog
                  </Link>
                </main>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
