import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIngredients, getPastaTypes, getRecipe, updateRecipe } from "../api";
import styles from "./EditRecipePage.module.css";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pastaTypeId, setPastaTypeId] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [meatType, setMeatType] = useState("");
  const [sauceType, setSauceType] = useState("");

  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [addedIngredients, setAddedIngredients] = useState([]);

  const [stepText, setStepText] = useState("");
  const [steps, setSteps] = useState([]);

  const [pastaTypes, setPastaTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load existing recipe data for pre-fill
  useEffect(() => {
    async function loadData() {
      try {
        const [recipe, types, ingredients] = await Promise.all([
          getRecipe(id),
          getPastaTypes(),
          getIngredients(),
        ]);

        setName(recipe.name || "");
        setPastaTypeId(recipe.pasta_type_id || "");
        setPrepTime(recipe.prep_time || "");
        setCookTime(recipe.cook_time || "");
        setServings(recipe.servings || "");
        setMeatType(recipe.meat_type || "");
        setSauceType(recipe.sauce_type || "");

        // Map ingredients to match the shape AddRecipePage uses
        setAddedIngredients(
          recipe.ingredients.map((ing) => ({
            ingredient_id: ing.ingredient_id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
        );

        // Steps are just the instruction strings
        setSteps(recipe.steps.map((s) => s.instruction));

        setPastaTypes(types);
        setAllIngredients(ingredients);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  function handleAddIngredient() {
    if (!selectedIngredientId || !ingredientQuantity || !ingredientUnit) return;
    const ingredient = allIngredients.find(
      (i) => i.id === parseInt(selectedIngredientId),
    );
    if (!ingredient) return;
    setAddedIngredients([
      ...addedIngredients,
      {
        ingredient_id: ingredient.id,
        name: ingredient.name,
        quantity: ingredientQuantity,
        unit: ingredientUnit,
      },
    ]);
    setSelectedIngredientId("");
    setIngredientQuantity("");
    setIngredientUnit("");
  }

  function handleRemoveIngredient(index) {
    setAddedIngredients(addedIngredients.filter((_, i) => i !== index));
  }

  function handleAddStep() {
    if (!stepText.trim()) return;
    setSteps([...steps, stepText.trim()]);
    setStepText("");
  }

  function handleRemoveStep(index) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateRecipe(id, {
        name,
        pasta_type_id: pastaTypeId,
        prep_time: prepTime,
        cook_time: cookTime,
        servings,
        meat_type: meatType,
        sauce_type: sauceType,
        ingredients: addedIngredients,
        steps,
      });
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update recipe.");
    }
  }

  if (loading)
    return (
      <main>
        <p>Loading recipe...</p>
      </main>
    );

  return (
    <main>
      <div className={styles.pageHeader}>
        <Link to={`/recipes/${id}`} className={styles.homeLink}>
          Back
        </Link>
        <h1 className={styles.pageTitle}>Edit Recipe</h1>
      </div>

      {error && <p style={{ color: "red", padding: "0 20px" }}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Recipe Info</h2>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Recipe Name</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Pasta Type</label>
            <select
              className={styles.select}
              value={pastaTypeId}
              onChange={(e) => setPastaTypeId(e.target.value)}
              required
            >
              <option value="">Select a pasta type</option>
              {pastaTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Prep Time (minutes)</label>
              <input
                className={styles.input}
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Cook Time (minutes)</label>
              <input
                className={styles.input}
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Servings</label>
              <input
                className={styles.input}
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Meat Type</label>
              <select
                className={styles.select}
                value={meatType}
                onChange={(e) => setMeatType(e.target.value)}
              >
                <option value="">None</option>
                <option value="pork">Pork</option>
                <option value="beef">Beef</option>
                <option value="chicken">Chicken</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Sauce Type</label>
            <select
              className={styles.select}
              value={sauceType}
              onChange={(e) => setSauceType(e.target.value)}
            >
              <option value="">None</option>
              <option value="red">Red</option>
              <option value="white">White</option>
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Ingredients</h2>
          <div className={styles.addRow}>
            <select
              className={styles.addRowInput}
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
            >
              <option value="">Select ingredient</option>
              {allIngredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
            <input
              className={styles.addRowInput}
              type="number"
              placeholder="Quantity"
              value={ingredientQuantity}
              onChange={(e) => setIngredientQuantity(e.target.value)}
              style={{ maxWidth: "100px" }}
            />
            <input
              className={styles.addRowInput}
              type="text"
              placeholder="Unit (e.g. grams)"
              value={ingredientUnit}
              onChange={(e) => setIngredientUnit(e.target.value)}
              style={{ maxWidth: "140px" }}
            />
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddIngredient}
            >
              + Add
            </button>
          </div>
          <ul className={styles.itemList}>
            {addedIngredients.map((ing, index) => (
              <li key={index} className={styles.itemRow}>
                <span>
                  {ing.name} — {ing.quantity} {ing.unit}
                </span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Ingredients */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Ingredients</h2>
          <div className={styles.addRow}>
            <select
              className={styles.addRowInput}
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
            >
              <option value="">Select ingredient</option>
              {allIngredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
            <input
              className={styles.addRowInput}
              type="number"
              placeholder="Quantity"
              value={ingredientQuantity}
              onChange={(e) => setIngredientQuantity(e.target.value)}
              style={{ maxWidth: "100px" }}
            />
            <input
              className={styles.addRowInput}
              type="text"
              placeholder="Unit (e.g. grams)"
              value={ingredientUnit}
              onChange={(e) => setIngredientUnit(e.target.value)}
              style={{ maxWidth: "140px" }}
            />
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddIngredient}
            >
              + Add
            </button>
          </div>
        </section>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
          <Link to={`/recipes/${id}`} className={styles.cancelLink}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
