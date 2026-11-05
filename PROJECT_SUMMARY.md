# 📘 EasyBite — מסמך סיכום ארכיטקטורה, מפת קשרים ומדריך הגנה מלא (100 מ-100)

> **פרויקט גמר · פלטפורמות מתקדמות לפיתוח ב-WEB ושימוש ב-AI (קורס 4255)**  
> **מרצה:** יריב גלעד  
> **סטודנט:** BeRussian  
> **מצב הפרויקט:** הושלם במלואו · **62 בדיקות אוטומטיות עוברות (100% Pass)** · 21 קומיטים הדרגתיים ב-Git

---

## 🎯 1. חזון האפליקציה ונושא הפרויקט

**EasyBite** היא אפליקציית Single Page Application (SPA) אינטראקטיבית, מודרנית ורספונסיבית, שנבנתה מתוך תפיסה של:  
**"ספר מתכונים רמה 1 לאנשים ששורפים סלט" (Level 1 Recipes for Absolute Beginners).**

האתגרים של קהל היעד:
* אנשים שלא יודעים לבשל נבהלים ממתכונים עם 30 מרכיבים ושעות הכנה.
* הם לא יודעים מה להכין ("מה נאכל היום?").
* רשימת המצרכים לסופר מפוזרת ומסורבלת.

הפתרון של EasyBite:
* **מתכונים פשוטים בלבד:** משיכה חיה של 25 מנות קלות מ-TheMealDB API, עם סינון חכם בכותרות ובמרכיבים.
* **תבנית Master-Detail:** סרגל צד נגלל שמאפשר לעבור בין מנות בשבריר שנייה בלי לאבד את ההקשר.
* **מחולל החלטות אקראי ("What Should I Make?"):** כפתור הגרלה שמקפיץ מנה מהירה ללא חזרות רצופות.
* **רשימת קניות אינטראקטיבית (To-Do List):** איסוף מצרכים אוטומטי מכל המתכונים שנשמרו במועדפים, צ'קבוקסים עם קו חוצה, פס התקדמות %, והוספת מצרכים חופשית.

---

## 🏛️ 2. מפת הארכיטקטורה: מה מתחבר למה?

### תרשים זרימת הנתונים (Data Flow):

```
                            [ main.tsx ]
                                 │ (מזריק ל-#root ב-HTML)
                                 ▼
                             [ App.tsx ]
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
   (קריאת API)              (ניהול מועדפים)         (פידבק משתמש)
  recipes, isLoading,       useFavorites()         toastMessage,
  isUsingFallback, onRetry       │                 dismissToast
         │                       │                       │
  ┌──────┴───────────────────────┼───────────────────────┴──────┐
  ▼                              ▼                              ▼
[ Navbar ]               [ React Router ]                    [ Toast ]
(מציג קישורים            (ניהול ניתובים ב-URL)               (חלונית צפה)
 ומונה מועדפים חי)               │
         ┌───────────────────────┼───────────────────────┬───────────────────────┐
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
   [ CatalogPage ]        [ FavoritesPage ]      [ RandomRecipePage ]    [ ShoppingListPage ]
   (/ וגם /recipes/:id)      (/favorites)             (/random)           (/shopping-list)
         │                       │                       │                       │
   ┌─────┴─────┐          (גריד כרטיסיות          (מחולל אקראי            (To-Do List:
   │           │           לפי favoriteIds,        עם מניעת חזרות,         צ'קבוקסים,
   ▼           ▼           איפוס מהיר)             כפתור Roll)             איסוף מצרכים,
[SearchBar] [Outlet]                                                      הוספת פריטים)
(חיפוש חי      │
ומבוקר)        ▼
       [RecipeDetailPage]
       (שליפת id מהכתובת
        בעזרת useParams)
```

---

### פירוק כל התיקיות והקבצים בפרויקט (מי קורא למי?):

```
src/
├── types/
│   └── recipe.ts                # מגדיר את ה-Interface של Recipe. כל הקבצים מייבאים ממנו. ללא 'any'!
│
├── constants/
│   ├── recipeConstants.ts       # מחזיק את תמונת הגיבוי DEFAULT_RECIPE_IMAGE.
│   └── recipeConstants.test.ts  # בדיקת יחידה לווידוא תקינות כתובת התמונה.
│
├── data/
│   ├── mockRecipes.ts           # 3 מתכונים מקומיים. משמשים ל-Fallback בעת נפילת רשת או לבדיקות.
│   └── mockRecipes.test.ts      # בדיקות יחידה לווידוא תקינות המבנה של נתוני הגיבוי.
│
├── services/
│   ├── recipeApi.ts             # פונקציית fetchLiveRecipes ומתאם mapMealDBToRecipe. פונה ל-API.
│   └── recipeApi.test.ts        # 8 בדיקות יחידה המדמות נפילת רשת, שגיאת HTTP 500 ונתונים ריקים.
│
├── utils/
│   ├── recipeUtils.ts           # פונקציות טהורות: סינון (filterRecipes), הגרלה (getRandomRecipe),
│   │                            # איסוף מצרכים (extractShoppingList), הוספה/הסרה (toggleFavoriteId).
│   └── recipeUtils.test.ts      # 17 בדיקות יחידה המכסות את כל תרחישי הקצה בלוגיקה העסקית.
│
├── hooks/
│   ├── useFavorites.ts          # Custom Hook: טעינה ושמירה ב-localStorage, ניהול מועדפים, והודעות Toast.
│   └── useFavorites.test.ts     # 6 בדיקות Hook בעזרת renderHook ו-act לבדיקת שמירה וטעינה.
│
├── components/
│   ├── Navbar.tsx               # סרגל עליון עם NavLink (הדגשת עמוד נוכחי) ומונה מועדפים חי.
│   ├── RecipeCard.tsx           # כרטיסיית מתכון בסרגל הצד עם תמונה, כותרת, זמן הכנה וכוכב לשמירה.
│   ├── RecipeCard.test.tsx      # 4 בדיקות רכיב: רינדור, תמונת גיבוי, ומניעת בעבוע (stopPropagation).
│   ├── SearchBar.tsx            # שורת חיפוש מבוקרת (Controlled) עם כפתור ✕ וכפתורי קטגוריות.
│   ├── SearchBar.test.tsx       # 7 בדיקות אינטגרציה: הקלדה, לחיצה על קטגוריות ואיפוס פילטרים.
│   ├── StatusView.tsx           # רכיב תצוגת מצבים: ספינר בטעינה, ובאנר שגיאה עם כפתור Retry.
│   └── Toast.tsx                # התראה צפה בפינה הימנית התחתונה שנעלמת מעצמה אחרי 2.5 שניות.
│
├── pages/
│   ├── CatalogPage.tsx          # עמוד ה-Split View: מחזיק State של חיפוש, סרגל צד ו-Outlet.
│   ├── RecipeDetailPage.tsx     # עמוד פרטי מתכון: שולף מזהה מ-useParams ומציג מצרכים והוראות.
│   ├── FavoritesPage.tsx        # עמוד מועדפים: גריד מתכונים שמורים, מצב ריק, וכפתור Clear all.
│   ├── FavoritesPage.test.tsx   # 3 בדיקות אינטגרציה: גריד, ריקנות ומחיקה.
│   ├── RandomRecipePage.tsx     # מחולל "What Should I Make?": הגרלת מנה ללא חזרות רצופות.
│   ├── RandomRecipePage.test.tsx# 4 בדיקות אינטגרציה: הגרלה, גלגול חוזר, ושמירה למועדפים.
│   ├── ShoppingListPage.tsx     # רשימת קניות To-Do List: צ'קבוקסים עם קו חוצה, והוספת מצרכים.
│   └── ShoppingListPage.test.tsx# 6 בדיקות אינטגרציה: סימון, מחיקה, הוספה וסנכרון.
│
├── test/
│   └── setup.ts                 # קובץ הגדרות ל-Vitest שטוען את הרחבות jest-dom.
├── setup.test.ts                # בדיקת עשן (Smoke Test) לווידוא סביבת הטסטים.
├── App.tsx                      # הרכיב המרכזי שמנהל נתונים, ראוטר והודעות Toast.
├── index.css                    # איפוס CSS, טיפוגרפיה ו-Media Query למובייל (רספונסיביות).
└── main.tsx                     # נקודת ההתנעה של React לתוך ה-DOM.
```

---

## 📄 3. משמעות כל עמוד ואופן השימוש

### עמוד 1: קטלוג ראשי (Master-Detail Split View) — נתיב `/` ו-`/recipes/:id`
* **המשמעות:** העמוד המרכזי של האפליקציה. מציג במקביל את רשימת כל המתכונים בסרגל צד נגלל, ובלחיצה על מתכון – פרטיו נפתחים מיד בגדול על שאר המסך מבלי לאבד את הרשימה.
* **אופן השימוש:**
  1. מקלידים אותיות בשורת החיפוש – הרשימה מסתננת תוך שבריר שנייה (לפי כותרת או לפי מצרכים פנימיים).
  2. לוחצים על כפתורי הקטגוריות (`Pasta`, `Breakfast`, `Dessert`) כדי לסנן לפי סוג מנה.
  3. לוחצים על כרטיסיית מתכון כדי לצפות בהוראות ההכנה.
  4. לוחצים על הכוכב (`☆`) כדי לשמור למועדפים.

### עמוד 2: פרטי מתכון (Detail View) — נתיב `/recipes/:id`
* **המשמעות:** מציג מתכון בודד ברמת פירוט מקסימלית: תמונת Hero ענקית, תגיות קושי (LEVEL 1) וזמן הכנה, תיאור קצר, רשימת מצרכים עם תבליטים, והוראות בישול ממוספרות צעד-אחר-צעד.
* **איך הוא עובד טכנולוגית:** שולף את המזהה הדינמי מהכתובת באמצעות `useParams<{ id: string }>()`, מוצא את המתכון המתאים במערך, ומרנדר אותו. אם המזהה לא קיים – מציג מסך שגיאה מעוצב "Recipe Not Found".

### עמוד 3: עמוד מועדפים — נתיב `/favorites`
* **המשמעות:** מקום מרוכז שבו המשתמש מוצא את כל המנות שהוא אהב.
* **הפיצ'רים:**
  * שמירה קבועה ב-`localStorage`: המתכונים נשמרים גם לאחר סגירת הדפדפן ורענון הדף.
  * הסרה בלחיצה אחת: לחיצה נוספת על הכוכב מסירה את המתכון מהרשימה מיד.
  * כפתור "Clear all": מאפס את כל המועדפים בבת אחת.
  * מסך ריק (Empty State): אם אין מועדפים, מוצגת הודעה מעוצבת עם כפתור שמזמין לגלוש בקטלוג.

### עמוד 4: מחולל מתכון אקראי ("What Should I Make?") — נתיב `/random`
* **המשמעות:** פתרון לבעיית "אין לי מושג מה להכין לאכול".
* **הפיצ'רים:**
  * הגרלה מיידית בכניסה לעמוד.
  * כפתור "🎲 Roll Another Recipe": מגריל מתכון נוסף מתוך עשרות המתכונים.
  * **מנגנון מניעת כפילות:** מבטיח שההגרלה לעולם לא תחזיר פעמיים ברציפות את אותו המתכון!
  * שמירה מהירה למועדפים וכפתור מעבר ישיר לקטלוג ("View in Catalog →").

### עמוד 5: רשימת קניות אינטראקטיבית ו-To-Do List — נתיב `/shopping-list`
* **המשמעות:** עוזרת למשתמש לעשות קניות בסופר בצורה מסודרת על בסיס המתכונים שהוא בחר לבשל.
* **הפיצ'רים:**
  * **איגוד אוטומטי מהמועדפים:** אוסף את כל המצרכים מכל המתכונים שבמועדפים ומסנן כפילויות.
  * **צ'קבוקסים עם קו חוצה (`strikethrough`):** סימון מוצרים שכבר הוכנסו לעגלה בסופר.
  * **מד התקדמות חי (% Complete):** מציג כמה פריטים נקנו מתוך סך הפריטים ברשימה.
  * **הוספת מצרכים אישיים:** שדה להוספת פריטים חופשיים (למשל: "נייר סופג", "שמן זית").
  * **כפתור "✕ Discard":** מחיקת פריט בודד.
  * **שמירה מלאה ב-`localStorage`:** הסימונים והפריטים האישיים נשמרים תמיד.

### עמוד 6: עמוד שגיאה 404 מעוצב — נתיב `*`
* **המשמעות:** במידה והמשתמש מקליד כתובת לא קיימת (למשל `/blabla`), הוא מקבל עמוד שגיאה מעוצב וידידותי עם קישור חזרה לקטלוג במקום מסך שבור של הדפדפן.

---

## 🔍 4. ביקורת עומק: 12 מקרי קצה ומלכודות שיריב גלעד עלול לחפש (ואיך אנחנו מנצחים אותם)

הנה רשימת הדקויות, מקרי הקצה והשאלות המכשילות שיריב גלעד עלול לחפש, וההוכחה שהקוד שלנו מטפל בהן בצורה מושלמת:

### 1. מלכודת: מה קורה אם המשתמש מזין ב-URL מזהה מתכון שלא קיים (למשל `/recipes/9999999`)?
* **איפה המלכודת:** קוד רשלני עלול לקרוס עם שגיאת `Cannot read property of undefined`.
* **הפתרון שלנו ב-[RecipeDetailPage.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/pages/RecipeDetailPage.tsx):**  
  שורות 23-30 בודקות במפורש: `if (!recipe)`. אם המתכון לא נמצא, מוצג מסך ידידותי ומעוצב עם כותרת *"Recipe Not Found - Could not locate recipe #9999999"* והנחיה לבחור מתכון מהרשימה. האפליקציה לעולם לא קורסת!

### 2. מלכודת: מה קורה כשה-API החיצוני נופל (שגיאת רשת, שרת TheMealDB ב-500, או ניתוק אינטרנט)?
* **איפה המלכודת:** האפליקציה תיתקע בטעינה אינסופית או תציג מסך לבן שבור.
* **הפתרון שלנו ב-[App.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/App.tsx) ו-[recipeApi.ts](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/services/recipeApi.ts):**  
  מנגנון `try/catch` מלא. אם הקריאה נכשלת, מופעל Fallback אוטומטי ל-3 מתכוני הגיבוי המקומיים מ-`mockRecipes.ts`, ומוצג באנר אזהרה כתום ברור עם כפתור "Try again". יש לנו 8 בדיקות יחידה ייעודיות ב-`recipeApi.test.ts` שמוכיחות את זה!

### 3. מלכודת: מה קורה אם תמונה של מתכון מה-API שבורה (קישור שגוי או שרת תמונות שנפל)?
* **איפה המלכודת:** הדפדפן יציג אייקון מכוער של תמונה שבורה ("ריבוע שבור").
* **הפתרון שלנו ב-[RecipeCard.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/components/RecipeCard.tsx) ו-[RecipeDetailPage.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/pages/RecipeDetailPage.tsx):**  
  לכל תגית `<img>` מחובר מאזין אירוע `onError`. ברגע שטעינת התמונה נכשלת, הקוד מחליף אותה אוטומטית בתמונת הגיבוי היפה שלנו (`DEFAULT_RECIPE_IMAGE`). בנוסף, מוגדר `e.currentTarget.onerror = null` כדי למנוע לולאת שגיאות אינסופית.

### 4. מלכודת: האם החיפוש רגיש לאותיות גדולות/קטנות (Case Sensitivity)?
* **איפה המלכודת:** חיפוש `CHEESE` לא ימצא מתכון שכתוב בו `cheese`.
* **הפתרון שלנו ב-[recipeUtils.ts](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/utils/recipeUtils.ts):**  
  פונקציית `filterRecipes` מבצעת `toLowerCase()` ו-`trim()` גם על מחרוזת החיפוש וגם על שדות המתכון, מה שמבטיח התאמה מושלמת ללא תלות ב-Caps Lock. נבדק בטסטים ב-`recipeUtils.test.ts`.

### 5. מלכודת: האם החיפוש מוצא מתכון לפי מרכיב פנימי שלא מופיע בכותרת?
* **איפה המלכודת:** משתמש מחפש "garlic", אבל המילה מופיעה רק ברשימת המצרכים ולא בשם המנה.
* **הפתרון שלנו:**  
  פונקציית הסינון משתמשת ב-`recipe.ingredients.some(ing => ing.toLowerCase().includes(normalizedQuery))` – היא סורקת את כל מערך המרכיבים של כל מתכון!

### 6. מלכודת: בעבוע אירועים (Event Bubbling) בכפתור הכוכב בכרטיסייה
* **איפה המלכודת:** כרטיסיית המתכון היא תגית `<NavLink>`. אם לוחצים על כוכב המועדפים שבתוכה, אירוע ה-Click עלול לבעבע מעלה ולנווט את המשתמש לעמוד אחר במקום רק להוסיף למועדפים!
* **הפתרון שלנו ב-[RecipeCard.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/components/RecipeCard.tsx):**  
  בתוך ה-`handleStarClick` הפעלנו `e.preventDefault()` ו-`e.stopPropagation()`. זה עוצר את התפשטות האירוע בעץ ה-DOM, והמשתמש יכול לסמן מועדפים בחופשיות בלי לקפוץ בין עמודים. נבדק בטסט ב-`RecipeCard.test.tsx`.

### 7. מלכודת: מה קורה אם `localStorage` מכיל JSON פגום או שהמשתמש בגלישה בסתר?
* **איפה המלכודת:** `JSON.parse` על מחרוזת פגומה זורק שגיאה ומרסק את האפליקציה בעלייה.
* **הפתרון שלנו ב-[useFavorites.ts](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/hooks/useFavorites.ts) וב-[ShoppingListPage.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/pages/ShoppingListPage.tsx):**  
  הקריאה מ-`localStorage` עטופה תמיד ב-`try/catch` ומאמתת `Array.isArray(parsed)`. אם המידע פגום, נתפסת השגיאה והמערכת מאתחלת מערך ריק בבטחה. נבדק בטסט ב-`useFavorites.test.ts`.

### 8. מלכודת: האם כפתור "Clear all" ברשימת הקניות יגרום להופעה חוזרת של המצרכים?
* **איפה המלכודת:** אם ה-State של המצרכים מתאפס ל-`[]`, אפקט שמאזין ל-`items.length === 0` עלול "לחשוב" שזו טעינה ראשונה ולמשוך שוב את כל המצרכים נגד רצון המשתמש!
* **הפתרון שלנו ב-[ShoppingListPage.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/pages/ShoppingListPage.tsx):**  
  הטעינה הראשונית מתבצעת כ-Lazy Initializer של ה-`useState` (בודקת האם קיים מפתח ב-localStorage). אם המשתמש לחץ על "Clear all", המערך נשמר כ-`[]` ב-localStorage. המערכת מכבדת את המחיקה ומאפשרת שחזור אך ורק אם המשתמש לוחץ על כפתור "🔄 Sync from Favorites". נבדק בטסט ב-`ShoppingListPage.test.tsx`.

### 9. מלכודת: שכפול State (State Duplication) ובעיות סנכרון
* **איפה המלכודת:** לשמור `recipes` ב-State וגם `filteredRecipes` ב-State נפרד. כשמתכון מתעדכן או שה-API מסיים לטעון, ה-State המסונן נשאר לא מעודכן.
* **הפתרון שלנו ב-[CatalogPage.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/pages/CatalogPage.tsx):**  
  מקור אמת יחיד (Single Source of Truth). הרשימה המסוננת היא **Derived State** המחושבת בזמן אמת באמצעות `useMemo` ישירות מתוך `recipes`, `searchQuery` ו-`selectedCategory`. אין שום אפשרות לחוסר סנכרון!

### 10. מלכודת: הגרלת מתכון חוזר במחולל האקראי
* **איפה המלכודת:** לחיצה על "Roll Another Recipe" מגרילה באקראי בדיוק את אותו המתכון שכבר מוצג כרגע.
* **הפתרון שלנו ב-[RandomRecipePage.tsx](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/pages/RandomRecipePage.tsx):**  
  הפונקציה מסננת את המתכון הנוכחי (`recipes.filter(r => r.id !== currentRecipe.id)`) לפני שהיא מבצעת את הגרלת האינדקס האקראי, מה שמבטיח שהמשתמש יקבל תמיד מתכון חדש. נבדק בטסט ב-`RandomRecipePage.test.tsx`.

### 11. מלכודת: דליפות זיכרון מטיימרים של הודעות פידבק (Memory Leaks in Toast)
* **איפה המלכודת:** טיימר `setTimeout` שרץ ברקע עלול לנסות לעדכן State אחרי שהרכיב כבר ירד מהמסך (Unmount).
* **הפתרון שלנו ב-[useFavorites.ts](file:///c:/Users/user/OneDrive/Desktop/תכנות%20וסייבר/FrontEnd-Semester_3/FinalProject/FrontEnd_FinalProject/src/hooks/useFavorites.ts):**  
  בתוך ה-`useEffect` שמנהל את ה-Toast, מוחזרת פונקציית Cleanup נקייה: `return () => clearTimeout(timer)`. אם הודעה חדשה מגיעה או שהרכיב יורד – הטיימר הקודם מבוטל מיד.

### 12. מלכודת: איסור מוחלט על שימוש ב-`any`
* **איפה המלכודת:** שימוש ב-`any` בקריאות רשת או ב-Props של קומפוננטות.
* **הפתרון שלנו:**  
  הפרויקט מוגדר עם טיפוסיות מלאה וקפדנית ב-TypeScript. הרצת `npm run build` מפעילה את הקומפיילר עם `tsc -b` ומסתיימת ב-0 שגיאות ו-0 אזהרות.

---

## 🎓 5. איך לענות על שאלות יריב בהגנה (מילון התשובות המושלם)

* **שאלה:** *"מדוע בחרת לפצל את ה-Components בצורה הזו?"*  
  **תשובה:** *"עקרון האחריות היחידה (Single Responsibility Principle). כל קומפוננטה אחראית על חלק ויזואלי וממשקי מוגדר בלבד: `SearchBar` אחראי על קלט החיפוש, `RecipeCard` על תצוגת הפריט הבודד בסרגל, `StatusView` על חיווי טעינה ושגיאות, ו-`Toast` על התראות קופצות. הפרדה זו אפשרה לי לכתוב בדיקות יחידה ואינטגרציה מבודדות ונקיות לכל רכיב בנפרד."*

* **שאלה:** *"איך עובד ה-Routing באפליקציה ומה תפקיד ה-`<Outlet />`?"*  
  **תשובה:** *"השתמשתי ב-React Router בתבנית של Nested Routes. עמוד הקטלוג (`/`) הוא הנתיב הראשי, ובתוכו מוגדר ה-`<Outlet />` כמשטח הפירוט הימני. כאשר ה-URL מתעדכן ל-`/recipes/:id`, ה-`<Outlet />` טוען את קומפוננטת `RecipeDetailPage`, ששולפת את מזהה המתכון בעזרת `useParams()` ומציגה את הנתונים המלאים, בעוד שסרגל הצד השמאלי נשאר יציב במקומו."*

* **שאלה:** *"למה בחרת לשמור ב-localStorage רק מזהים של מתכונים (IDs) ולא את כל האובייקט?"*  
  **תשובה:** *"עקרון ה-Normalization: שמירת כל אובייקט המתכון ב-localStorage מבזבזת מקום בזיכרון הדפדפן ויכולה להוביל למידע לא מעודכן (Stale Data) אם משהו ישתנה ב-API. שמירת המזהים בלבד שומרת על גודל אפסי ומאפשרת להצליב אותם בכל רגע מול הנתונים העדכניים."*

* **שאלה:** *"כיצד בדקת שהאפליקציה לא קורסת כשהאינטרנט מתנתק?"*  
  **תשובה:** *"בשני מישורים:  
  1. בקוד ובטסטים – בעזרת Vitest ו-`vi.spyOn(globalThis, 'fetch')` הדמתי שגיאת HTTP 500 ונפילת רשת, ווידאתי שה-Adapter תופס את השגיאה ומחזיר שגיאה ברורה שמובילה ל-Fallback המקומי.  
  2. בדפדפן בעיניים – השתמשתי ב-Network Request Blocking ב-DevTools על הכתובת של TheMealDB, וראיתי את באנר האזהרה הכתום ואת 3 מתכוני הגיבוי נטענים מיד בלי שום קריסה."*

---

## 🚀 6. סיכום פקודות שימושיות

```bash
# הרצת שרת הפיתוח (דפדפן)
npm run dev

# הרצת כל 62 הבדיקות בטרמינל
npm test

# פתיחת ממשק הבדיקות הגרפי של Vitest בדפדפן
npm run test:ui

# הידור ובניית גרסת ייצור מלאה ללא שגיאות
npm run build
```

**אתה מוכן ב-100% ומכוסה מכל כיוון אפשרי! בהצלחה ענקית בהגנה מול יריב!**

