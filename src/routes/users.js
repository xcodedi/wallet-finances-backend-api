const express = require("express");
const router = express.Router();
const db = require("../db");

const API_KEY = "cafe"; // Defina sua chave de API aqui

// Função auxiliar para encontrar um usuário por email
const findOne = (email) => {
  return {
    name: "fetch-user",
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };
};

// Rota para criar um novo usuário
router.post("/", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  try {
    // Verificar se o usuário já existe
    const userQuery = findOne(email);
    const existingUser = await db.query(userQuery);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Inserir novo usuário no banco de dados
    const result = await db.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
      [email, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting into the database:", err);
    res.status(500).send("Error inserting into the database");
  }
});

// Rota para obter um usuário por email
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const userQuery = findOne(email);
    const result = await db.query(userQuery);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Error querying the database");
  }
});

// Rota para atualizar um usuário por email
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const { name } = req.body;
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await db.query(
      "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
      [name, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating the database:", err);
    res.status(500).send("Error updating the database");
  }
});

// Rota para deletar um usuário por email
router.delete("/:email", async (req, res) => {
  const { email } = req.params;
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  try {
    const result = await db.query(
      "DELETE FROM users WHERE email = $1 RETURNING *",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User successfully deleted" });
  } catch (err) {
    console.error("Error deleting from the database:", err);
    res.status(500).send("Error deleting from the database");
  }
});

module.exports = router;
