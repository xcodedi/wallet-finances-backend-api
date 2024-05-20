const express = require("express");
const router = express.Router();
const db = require("../db");

// Rota GET para obter todas as categorias
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao consultar o banco de dados:", err);
    res.status(500).send("Erro ao consultar o banco de dados");
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
    console.error("Erro ao inserir no banco de dados:", err);
    res.status(500).send("Erro ao inserir no banco de dados");
  }
});

module.exports = router;
