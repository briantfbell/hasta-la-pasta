import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRecipe, getIngredients, getPastaTypes } from "../api";
import styles from "./AddRecipePage.module.css";

export default function AddRecipePage() {
  const navigate = useNavigate();

  // Basic recipe fields
  const [name, setName] = useState("");
  const [pastaTypeId, setPastaTypeId] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [meatType, setMeatType] = useState("");
  const [sauceType, setSauceType] = useState("");

  // Ingredients
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [addedIngredients, setAddedIngredients] = useState([]);

  // Steps
  const [stepText, setStepText] = useState("");
  const [steps, setSteps] = useState([]);

  // Pasta types for dropdown
  const [pastaTypes, setPastaTypes] = useState([]);

  const [error, setError] = useState("");

  // Load pasta types and ingredients on mount
  useEffect(() => {
    async function loadOptions() {
      try {
        const [types, ingredients] = await Promise.all([
          getPastaTypes(),
          getIngredients(),
        ]);
        setPastaTypes(types);
        setAllIngredients(ingredients);
      } catch (err) {
        console.error(err);
        setError("Failed to load options.");
      }
    }
    loadOptions();
  }, []);

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
      await createRecipe({
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
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to save recipe.");
    }
  }

  return (
    <main>
      <div className={styles.pageHeader}>
        <Link to="/" className={styles.homeLink}>
          Home
        </Link>
        <h1 className={styles.pageTitle}>Add New Recipe</h1>
      </div>

      {error && <p style={{ color: "red", padding: "0 20px" }}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Basic Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Recipe Info</h2>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Recipe Name</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spaghetti Carbonara"
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
                placeholder="e.g. 10"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Cook Time (minutes)</label>
              <input
                className={styles.input}
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="e.g. 20"
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
                placeholder="e.g. 2"
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

        {/* Steps */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Steps</h2>
          <div className={styles.addRow}>
            <textarea
              className={styles.textarea}
              placeholder="Describe this step..."
              value={stepText}
              onChange={(e) => setStepText(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddStep}
            >
              + Add Step
            </button>
          </div>
          <ul className={styles.itemList}>
            {steps.map((step, index) => (
              <li key={index} className={styles.itemRow}>
                <span>
                  <strong>{index + 1}.</strong> {step}
                </span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveStep(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Photo */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Photo</h2>
          <div className={styles.photoUpload}>
            {" "}
            Upload your photo here! (Coming soon)
          </div>
        </section>

        {/* Submit */}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitButton}>
            Save Recipe
          </button>
          <Link to="/" className={styles.cancelLink}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
