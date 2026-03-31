import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../api";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  if (loading) {
    return (
      <main>
        <h1>Hasta la Pasta</h1>
        <p>Loading recipes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Hasta la Pasta</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Hasta la Pasta</h1>

      <div>
        <Link to="/recipes/new">Add New Recipe</Link>
      </div>

      <h2>Recipes</h2>

      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
              {recipe.pasta_type_name ? ` - ${recipe.pasta_type_name}` : ""}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
