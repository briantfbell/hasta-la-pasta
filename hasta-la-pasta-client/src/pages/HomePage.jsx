import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../api";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for filter portion
  const [selectedMeatType, setSelectedMeatType] = useState("");
  const [selectedSauceType, setSelectedSauceType] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  // Recipe filter/search function
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesMeat =
        !selectedMeatType || recipe.meat_type === selectedMeatType;

      const matchesSauce =
        !selectedSauceType || recipe.sauce_type === selectedSauceType;

      return matchesMeat && matchesSauce;
    });
  }, [recipes, selectedMeatType, selectedSauceType]);

  if (loading) {
    return (
      <main>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Hasta la Pasta</h1>
          <h2 className={styles.pageSubtitle}>The Easy Pasta Cookbook App!</h2>
        </div>
        <p>Loading recipes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Hasta la Pasta</h1>
          <h2 className={styles.pageSubtitle}>The Easy Pasta Cookbook App!</h2>
        </div>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Hasta la Pasta</h1>
        <h2 className={styles.pageSubtitle}>The Easy Pasta Cookbook App!</h2>
      </div>

      <div className={styles.layout}>
        {/* Recipes Panel */}
        <section className={styles.panel}>
          <h2 className={styles.panelHeader}>Recipes</h2>
          <div>
            <Link to="/recipes/new" className={styles.addLink}>
              + Add New Recipe
            </Link>
          </div>
          {filteredRecipes.length === 0 ? (
            <p>No recipes match your filter.</p>
          ) : (
            <ul className={styles.recipeList}>
              {filteredRecipes.map((recipe) => (
                <li key={recipe.id} className={styles.recipeItem}>
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className={styles.recipeLink}
                  >
                    {recipe.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Filter Panel */}
        <section className={styles.panel}>
          <h2 className={styles.panelHeader}>Find a Pasta</h2>
          <div className={styles.filterRow}>
            <label className={styles.filterLabel} htmlFor="meatType">
              Meat
            </label>
            <select
              className={styles.filterSelect}
              id="meatType"
              value={selectedMeatType}
              onChange={(e) => setSelectedMeatType(e.target.value)}
            >
              <option value="">All</option>
              <option value="pork">Pork</option>
              <option value="beef">Beef</option>
              <option value="chicken">Chicken</option>
            </select>
          </div>
          <div className={styles.filterRow}>
            <label className={styles.filterLabel} htmlFor="sauceType">
              Sauce
            </label>
            <select
              className={styles.filterSelect}
              id="sauceType"
              value={selectedSauceType}
              onChange={(e) => setSelectedSauceType(e.target.value)}
            >
              <option value="">All</option>
              <option value="red">Red</option>
              <option value="white">White</option>
            </select>
          </div>
          <button
            className={styles.clearButton}
            onClick={() => {
              setSelectedMeatType("");
              setSelectedSauceType("");
            }}
          >
            Clear Filters
          </button>
        </section>
      </div>
    </main>
  );
}
