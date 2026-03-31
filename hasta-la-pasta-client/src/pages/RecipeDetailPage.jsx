import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipe } from "../api";
import styles from "./RecipeDetailPage.module.css";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecipe(id);
        setRecipe(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this recipe?");
    if (!confirmed) return;
    try {
      await deleteRecipe(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete recipe.");
    }
  }

  if (loading)
    return (
      <main>
        <p>Loading recipe...</p>
      </main>
    );
  if (error)
    return (
      <main>
        <p>{error}</p>
        <Link to="/">Back to recipes</Link>
      </main>
    );
  if (!recipe)
    return (
      <main>
        <p>Recipe not found.</p>
        <Link to="/">Back to recipes</Link>
      </main>
    );

  return (
    <main>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.homeLink}>
          Home
        </Link>
        <h1 className={styles.recipeTitle}>{recipe.name}</h1>
      </div>

      {/* Three column layout */}
      <div className={styles.layout}>
        {/* Right: Metadata + Actions + Photo */}
        <section className={styles.panel}>
          <div className={styles.metaSection}>
            <span className={styles.tag}>
              Pasta Type: {recipe.pasta_type_name || "N/A"}
            </span>
            <span className={styles.tag}>
              Prep: {recipe.prep_time ?? "N/A"} min
            </span>
            <span className={styles.tag}>
              Cook: {recipe.cook_time ?? "N/A"} min
            </span>
            <span className={styles.tag}>
              Servings: {recipe.servings ?? "N/A"}
            </span>
          </div>

          <div className={styles.actionButtons}>
            <Link to={`/recipes/${recipe.id}/edit`}>
              <button className={styles.editButton}>Edit Recipe</button>
            </Link>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete Recipe
            </button>
          </div>

          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className={styles.photo}
            />
          ) : (
            <div className={styles.photoPlaceholder}>No Photo</div>
          )}
        </section>
        {/* Left: Ingredients */}
        <section className={styles.panel}>
          <h2 className={styles.panelHeader}>Ingredients</h2>
          {recipe.ingredients?.length ? (
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient.recipe_ingredient_id}
                  className={styles.ingredientItem}
                >
                  {ingredient.name} — {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
          ) : (
            <p>No ingredients listed.</p>
          )}
        </section>

        {/* Middle: Steps */}
        <section className={styles.panel}>
          <h2 className={styles.panelHeader}>Instructions</h2>
          {recipe.steps?.length ? (
            <ol className={styles.stepList}>
              {recipe.steps.map((step) => (
                <li key={step.id} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{step.step_number}</span>
                  <span>{step.instruction}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>No steps listed.</p>
          )}
        </section>
      </div>
    </main>
  );
}
