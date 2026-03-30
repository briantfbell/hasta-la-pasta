const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/pasta-types
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM pasta_types ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/pasta-types/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM pasta_types WHERE id = $1", [
      id,
    ]);
    if (!result.rows.length)
      return res.status(404).json({ error: "Pasta type not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/pasta-types/:id/recipes
router.get("/:id/recipes", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT r.*, pt.name AS pasta_type_name
       FROM recipes r
       JOIN pasta_types pt ON r.pasta_type_id = pt.id
       WHERE r.pasta_type_id = $1
       ORDER BY r.name`,
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/pasta-types
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const result = await db.query(
      "INSERT INTO pasta_types (name, description) VALUES ($1, $2) RETURNING *",
      [name, description],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/pasta-types/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await db.query(
      "UPDATE pasta_types SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, id],
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Pasta type not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/pasta-types/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM pasta_types WHERE id = $1 RETURNING *",
      [id],
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Pasta type not found" });
    res.json({ message: "Pasta type deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
