# PRD: EasyBite · Level 1 Cooking for Beginners

> **Product Requirements Document (PRD)**  
> **Author:** Student & Antigravity  
> **Course:** Advanced Frontend Platforms & AI (Course 4255)  
> **Lecturer:** Yariv Gilad  
> **Status:** Draft for Review  

---

## 1. Overview & Problem Statement
Most online recipe platforms assume prior kitchen experience, featuring lengthy lists of exotic ingredients, multi-step baking techniques, and complex equipment. For complete beginners—students living on their own, or anyone who jokes about "burning a salad"—this creates immediate anxiety and leads back to ordering expensive takeaway.

**EasyBite** solves this by providing a curated, zero-intimidation catalog of strictly **Level 1 recipes**. Every dish requires only basic pantry staples, under 15 minutes of prep, and foolproof directions.

---

## 2. Target Audience & Core Persona
- **Primary Users:** Absolute cooking novices, students, and busy beginners looking for quick, foolproof meals.
- **Tone & Feel:** Friendly, warm, encouraging, and clean (no jargon, no clutter).

---

## 3. Product Requirements & Acceptance Criteria ("When I..., I see...")

### 3.1 Catalog & Discovery (Master View — Route: `/`)
- **When I load the homepage**, I see an encouraging header banner (*"EasyBite: Cooking for people who burn salads"*), a search bar, category filter pills, and a responsive grid of recipe cards.
- **When data is being fetched**, I see a friendly loading indicator (*"Cooking up easy recipes..."*).
- **If the network request fails**, I see an informative error message explaining that recipes couldn't be loaded, with a retry button.
- **When I type in the search bar**, the recipe cards filter in real-time by title or ingredient matching.
- **When I click a category pill** (e.g. `Breakfast`, `Pasta`, `Starter`), I see only recipes matching that specific category.
- **When no recipes match my search**, I see a clear empty-state message (*"No recipes found. Try searching for something else!"*).

### 3.2 Recipe Detail View (Detail View — Route: `/recipes/:id`)
- **When I click on any recipe card in the catalog**, I navigate to `/recipes/:id` without a full page reload, and I see the full recipe view.
- **When viewing a recipe**, I see:
  1. A large photo of the dish.
  2. Recipe title, category, and a "Level 1 - Easy" badge.
  3. Total estimated preparation time (e.g., "10 mins").
  4. An ingredients card listing all needed items.
  5. Step-by-step numbered preparation instructions.
- **When I click "Save to Favorites"**, the button updates to "Remove from Favorites", the heart icon fills, and the recipe is added to my persistent favorites list.
- **When I click "← Back to Recipes"**, I return to the catalog view.

### 3.3 Saved Favorites View (Route: `/favorites`)
- **When I navigate to the Favorites page**, I see all the recipes I have marked as favorites.
- **When I reload the browser**, all my favorited recipes remain saved (persisted in `localStorage`).
- **When I remove a recipe from favorites**, it immediately disappears from this list.
- **When I have no saved favorites**, I see a friendly empty-state message with a link encouraging me to browse the catalog.

### 3.4 Interactive Decision Feature (Route: `/random`)
- **When I open the "What Should I Make?" page**, I see a prominent button: *"Feed Me Something Easy!"*.
- **When I click the button**, a random Level 1 recipe is selected instantly and displayed with its picture, time, and a direct button *"Let's Cook This!"* taking me to its detail page.

### 3.5 Interactive Shopping List Feature (Route: `/shopping-list`)
- **When I navigate to the Shopping List page**, I see an aggregated checklist of all ingredients from my favorited recipes.
- **When I click on an ingredient**, it toggles a strikethrough checkbox so I can track what I bought at the store.

---

## 4. Technical Specifications & Constraints
- **Framework:** React 19 + TypeScript + Vite.
- **Routing:** React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `useParams`).
- **State Management:** React `useState` & `useEffect` (clean, straightforward, no heavy external state libraries).
- **TypeScript Standard:** 100% strict type safety. **Zero `any` types**. Every API response and component prop is strongly typed.
- **Testing:** Vitest with at least 5 unit tests covering pure business logic (search filtering, category filtering, favorites toggle, shopping list aggregation).
- **Styling:** Custom clean responsive CSS, optimized for both desktop and mobile viewports.

---

## 5. Related Architecture & Testing Documents
- **[Recipe App Specification (RECIPE_APP_SPEC.md)](./RECIPE_APP_SPEC.md)** — Detailed data model and field definitions.
- **[Architecture Document (docs/architecture.md)](./docs/architecture.md)** — Component tree, routing map, and state flow. *(Next Step)*
- **[Testing Document (docs/testing.md)](./docs/testing.md)** — Vitest unit test cases and verification strategy. *(Next Step)*
- **[Work Plan (tasks.md)](./tasks.md)** — Step-by-step construction tasks with "Done when" acceptance criteria.
