const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/ingredients
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM ingredients ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/ingredients/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM ingredients WHERE id = $1", [
      id,
    ]);
    if (!result.rows.length)
      return res.status(404).json({ error: "Ingredient not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/ingredients/:id/recipes
router.get("/:id/recipes", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT r.*, pt.name AS pasta_type_name
       FROM recipes r
       JOIN recipe_ingredients ri ON r.id = ri.recipe_id
       JOIN pasta_types pt ON r.pasta_type_id = pt.id
       WHERE ri.ingredient_id = $1
       ORDER BY r.name`,
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/ingredients
router.post("/", async (req, res, next) => {
  try {
    const { name, default_unit, category } = req.body;
    const result = await db.query(
      "INSERT INTO ingredients (name, default_unit, category) VALUES ($1, $2, $3) RETURNING *",
      [name, default_unit, category],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/ingredients/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, default_unit, category } = req.body;
    const result = await db.query(
      "UPDATE ingredients SET name = $1, default_unit = $2, category = $3 WHERE id = $4 RETURNING *",
      [name, default_unit, category, id],
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Ingredient not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/ingredients/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM ingredients WHERE id = $1 RETURNING *",
      [id],
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Ingredient not found" });
    res.json({ message: "Ingredient deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
