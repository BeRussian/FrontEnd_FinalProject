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
 * Root application configuring the Nested Route Master-Detail architecture.
 */
export const App: FC = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top persistent navigation bar */}
        <Navbar />

        {/* Dynamic page routes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Split-View Master-Detail Route:
                - '/' renders sidebar + default recipe detail
                - '/recipes/:id' renders sidebar + selected recipe detail in <Outlet />
            */}
            <Route path="/" element={<CatalogPage />}>
              <Route index element={<RecipeDetailPage />} />
              <Route path="recipes/:id" element={<RecipeDetailPage />} />
            </Route>

            {/* Extra Views */}
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/random" element={<RandomRecipePage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />

            {/* 404 Not Found fallback */}
            <Route
              path="*"
              element={
                <main style={{ padding: '3rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
                  <h1>404: Page Not Found</h1>
                  <p>The page you requested could not be found.</p>
                  <Link to="/" style={{ color: '#e65100', fontWeight: 'bold' }}>
                    Return to Recipe Catalog
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
