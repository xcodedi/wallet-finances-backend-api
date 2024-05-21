const express = require("express");
const router = express.Router();
const db = require("../db");

// Rota GET para obter todas as categorias
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Error querying the database");
  }
});

// Rota POST para adicionar uma nova categoria
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (name.length < 3) {
    return res
      .status(400)
      .json({ error: "Name should have more than 3 characters!" });
  }

  try {
    const result = await db.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting into the database:", err);
    res.status(500).send("Error inserting into the database");
  }
});

// Rota DELETE para excluir uma categoria pelo ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category successfully deleted" });
  } catch (err) {
    console.error("Error deleting from the database:", err);
    res.status(500).send("Error deleting from the database");
  }
});

// Rota PUT para atualizar uma categoria pelo ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (name.length < 3) {
    return res
      .status(400)
      .json({ error: "Name should have more than 3 characters!" });
  }

  try {
    const result = await db.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating the database:", err);
    res.status(500).send("Error updating the database");
  }
});

module.exports = router;
