# App Specification: EasyBite · Level 1 Cooking for Beginners

> 🍳 **Product Vision:**  
> A friendly, clean, and zero-intimidation recipe application built specifically for cooking beginners and people who "burn salads".  
> All recipes are strictly **Level 1** — basic ingredients, quick prep times (10-15 minutes), and straightforward step-by-step instructions.

---

## 1. Core Guidelines & Decisions
- **App Name:** **EasyBite**
- **Interface Language:** English (matches TheMealDB API, avoids translation complexity, clean and unified styling).
- **Guiding Principle:** **Keep It Simple** — clear code, strict TypeScript types, no unnecessary libraries.
- **Data Source:** TheMealDB public API (`https://www.themealdb.com/api/json/v1/1/search.php?s=`), focused on simple categories (Breakfast, Starter, Pasta, Side).

---

## 2. Data Structure: The `Recipe` Object (TypeScript Interface)

Every recipe in EasyBite is structured as a typed object:

```typescript
export interface Recipe {
  id: string;              // Unique identifier (used in URL route: /recipes/:id)
  title: string;           // Recipe name (e.g., "Classic Scrambled Eggs")
  category: string;        // Category tag (e.g., "Breakfast", "Pasta", "Starter")
  image: string;           // URL to recipe image
  prepTime: string;        // Estimated time (e.g., "10 mins")
  difficulty: "Level 1";   // Reassuring constant indicator
  description: string;     // Short friendly one-liner summary
  ingredients: string[];   // Clean list of basic ingredients
  instructions: string[];  // Step-by-step ordered directions
}
```

---

## 3. Pages & Routing Architecture (React Router)

EasyBite is a **Single Page Application (SPA)** with seamless client-side routing:

### Page 1: Recipe Catalog (`/`) — Master View
- **Header Banner:** Encouraging greeting: *"EasyBite: Cooking for people who burn salads."*
- **Search & Filters:**
  - Instant text search by recipe name or ingredient.
  - Category filter pills: `All`, `Breakfast`, `Pasta`, `Starter`.
- **Recipe Grid:**
  - Responsive grid of `RecipeCard` components.
  - Each card shows: image, title, prep time, category pill, and a heart button for favorites.
  - Clicking any card navigates seamlessly to `/recipes/:id`.
- **System States:**
  - Clear Loading Spinner while fetching.
  - User-friendly Error / Empty message if no recipes match.

### Page 2: Recipe Detail (`/recipes/:id`) — Detail View
- Dynamic route using `useParams()` to grab the recipe ID.
- **Hero Display:** Large photo, recipe title, prep time, and difficulty badge ("Level 1").
- **Ingredients Checklist:** Clean visual card listing the ingredients.
- **Step-by-Step Instructions:** Clear, numbered guide (Step 1, Step 2...).
- **Interactive Actions:**
  - Favorite Button: Toggle "Save to Favorites" / "Remove from Favorites".
  - Back Button: "← Back to Recipes" returning to Catalog.

### Page 3: Saved Favorites (`/favorites`)
- Displays all recipes favorited by the user.
- **Persistent Storage:** Stored in `localStorage` so favorites remain intact after page reload.
- **Empty State:** Cheerful fallback message: *"No saved recipes yet! Go back to the catalog and pick something easy to make."*

### Page 4: Interactive Feature Options (Exploring Both)
The user will evaluate both features visually:
- **Option A: "What Should I Make?" (`/random`)**  
  A single click button *"Feed Me Something Easy!"* that rolls an instant random Level 1 recipe and displays an interactive recommendation card with a direct link to cook it.
- **Option B: Shopping List (`/shopping-list`)**  
  Aggregates ingredients from favorited recipes into an interactive checklist with checkable boxes to take to the grocery store.

---

## 4. Reusable UI Components
1. **`Navbar`:** Fixed top header with brand logo, navigation links (`Recipes`, `Favorites`, `Random`, `Shopping List`).
2. **`RecipeCard`:** Standard card representation for a recipe (reused across Catalog and Favorites).
3. **`SearchBar`:** Input field for text search and category buttons.
4. **`StatusView`:** Handles loading indicator and error messaging gracefully.
