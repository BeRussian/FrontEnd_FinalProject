import { type FC, useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import type { Recipe } from './types/recipe';
import { mockRecipes } from './data/mockRecipes';
import { fetchLiveRecipes } from './services/recipeApi';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { RandomRecipePage } from './pages/RandomRecipePage';
import { ShoppingListPage } from './pages/ShoppingListPage';

/**
 * App:
 * Root application component managing live API data fetching, loading state,
 * error handling, and graceful fallback to local recipes.
 */
export const App: FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  /**
   * Fetches recipes from TheMealDB public API.
   * If network fails or API is unreachable, catches error gracefully
   * and falls back to local mock recipes.
   */
  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const liveRecipes = await fetchLiveRecipes();
      setRecipes(liveRecipes);
      setIsUsingFallback(false);
    } catch (error) {
      console.warn('TheMealDB API unreachable. Reverting to local fallback recipes.', error);
      setRecipes(mockRecipes);
      setIsUsingFallback(true);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to connect to recipe API'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch after initial render (component mount)
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top navigation bar */}
        <Navbar />

        {/* Dynamic page routes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Split-View Master-Detail Route */}
            <Route
              path="/"
              element={
                <CatalogPage
                  recipes={recipes}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                  isUsingFallback={isUsingFallback}
                  onRetry={loadRecipes}
                />
              }
            >
              <Route index element={<RecipeDetailPage recipes={recipes} />} />
              <Route path="recipes/:id" element={<RecipeDetailPage recipes={recipes} />} />
            </Route>

            {/* Extra Views */}
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/random" element={<RandomRecipePage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />

            {/* 404 Fallback */}
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
