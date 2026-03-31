const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/recipes
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT r.*, pt.name AS pasta_type_name
       FROM recipes r
       LEFT JOIN pasta_types pt ON r.pasta_type_id = pt.id
       ORDER BY r.name`,
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipeResult = await db.query(
      `SELECT r.*, pt.name AS pasta_type_name
       FROM recipes r
       LEFT JOIN pasta_types pt ON r.pasta_type_id = pt.id
       WHERE r.id = $1`,
      [id],
    );

    if (!recipeResult.rows.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const ingredientsResult = await db.query(
      `SELECT
         ri.id AS recipe_ingredient_id,
         i.id AS ingredient_id,
         i.name,
         i.default_unit,
         i.category,
         ri.quantity,
         ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = $1
       ORDER BY i.name`,
      [id],
    );

    const stepsResult = await db.query(
      `SELECT id, step_number, instruction
       FROM steps
       WHERE recipe_id = $1
       ORDER BY step_number`,
      [id],
    );

    const recipe = recipeResult.rows[0];
    recipe.ingredients = ingredientsResult.rows;
    recipe.steps = stepsResult.rows;

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/:id/ingredients
router.get("/:id/ingredients", async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipeCheck = await db.query("SELECT * FROM recipes WHERE id = $1", [
      id,
    ]);
    if (!recipeCheck.rows.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const result = await db.query(
      `SELECT
         ri.id AS recipe_ingredient_id,
         i.id AS ingredient_id,
         i.name,
         i.default_unit,
         i.category,
         ri.quantity,
         ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = $1
       ORDER BY i.name`,
      [id],
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      prep_time,
      cook_time,
      servings,
      image_url,
      pasta_type_id,
      meat_type,
      sauce_type,
      ingredients,
      steps,
    } = req.body;

    const result = await db.query(
      `INSERT INTO recipes
       (name, prep_time, cook_time, servings, image_url, pasta_type_id, meat_type, sauce_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        prep_time,
        cook_time,
        servings,
        image_url,
        pasta_type_id,
        meat_type,
        sauce_type,
      ],
    );

    const recipe = result.rows[0];

    // Insert ingredients
    if (ingredients && ingredients.length) {
      for (const ing of ingredients) {
        await db.query(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
           VALUES ($1, $2, $3, $4)`,
          [recipe.id, ing.ingredient_id, ing.quantity, ing.unit],
        );
      }
    }

    // Insert steps
    if (steps && steps.length) {
      for (let i = 0; i < steps.length; i++) {
        await db.query(
          `INSERT INTO steps (recipe_id, step_number, instruction)
           VALUES ($1, $2, $3)`,
          [recipe.id, i + 1, steps[i]],
        );
      }
    }

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipes/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      prep_time,
      cook_time,
      servings,
      image_url,
      pasta_type_id,
      meat_type,
      sauce_type,
    } = req.body;

    const result = await db.query(
      `UPDATE recipes
       SET name = $1, prep_time = $2, cook_time = $3, servings = $4,
           image_url = $5, pasta_type_id = $6, meat_type = $7, sauce_type = $8
       WHERE id = $9
       RETURNING *`,
      [
        name,
        prep_time,
        cook_time,
        servings,
        image_url,
        pasta_type_id,
        meat_type,
        sauce_type,
        id,
      ],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipes/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM recipes WHERE id = $1 RETURNING *",
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted" });
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes/:id/ingredients
router.post("/:id/ingredients", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ingredient_id, quantity, unit } = req.body;

    const recipeCheck = await db.query("SELECT * FROM recipes WHERE id = $1", [
      id,
    ]);
    if (!recipeCheck.rows.length) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const ingredientCheck = await db.query(
      "SELECT * FROM ingredients WHERE id = $1",
      [ingredient_id],
    );
    if (!ingredientCheck.rows.length) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    const result = await db.query(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, ingredient_id, quantity, unit],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipes/:id/ingredients/:ingredientId
router.put("/:id/ingredients/:ingredientId", async (req, res, next) => {
  try {
    const { id, ingredientId } = req.params;
    const { quantity, unit } = req.body;

    const result = await db.query(
      `UPDATE recipe_ingredients
       SET quantity = $1,
           unit = $2
       WHERE recipe_id = $3 AND ingredient_id = $4
       RETURNING *`,
      [quantity, unit, id, ingredientId],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Recipe ingredient not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipes/:id/ingredients/:ingredientId
router.delete("/:id/ingredients/:ingredientId", async (req, res, next) => {
  try {
    const { id, ingredientId } = req.params;

    const result = await db.query(
      `DELETE FROM recipe_ingredients
       WHERE recipe_id = $1 AND ingredient_id = $2
       RETURNING *`,
      [id, ingredientId],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Recipe ingredient not found" });
    }

    res.json({ message: "Ingredient removed from recipe" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
