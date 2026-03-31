import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipe } from "../api";

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

  if (loading) {
    return (
      <main>
        <h1>Loading recipe...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link to="/">Back to recipes</Link>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <p>Recipe not found.</p>
        <Link to="/">Back to recipes</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/">Back to recipes</Link>

      <h1>{recipe.name}</h1>

      <p>
        <strong>Pasta Type:</strong> {recipe.pasta_type_name || "N/A"}
      </p>
      <p>
        <strong>Prep Time:</strong> {recipe.prep_time ?? "N/A"} minutes
      </p>
      <p>
        <strong>Cook Time:</strong> {recipe.cook_time ?? "N/A"} minutes
      </p>
      <p>
        <strong>Servings:</strong> {recipe.servings ?? "N/A"}
      </p>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          style={{ maxWidth: "300px", display: "block", marginBottom: "1rem" }}
        />
      )}

      <section>
        <h2>Ingredients</h2>
        {recipe.ingredients?.length ? (
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.recipe_ingredient_id}>
                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients listed.</p>
        )}
      </section>

      <section>
        <h2>Instructions</h2>
        {recipe.steps?.length ? (
          <ol>
            {recipe.steps.map((step) => (
              <li key={step.id}>{step.instruction}</li>
            ))}
          </ol>
        ) : (
          <p>No steps listed.</p>
        )}
      </section>

      <div>
        <Link to={`/recipes/${recipe.id}/edit`}>Edit Recipe</Link>
        {" | "}
        <button onClick={handleDelete}>Delete Recipe</button>
      </div>
    </main>
  );
}
