// Importa o framework Express para criar o servidor e definir rotas
const express = require("express");
const router = express.Router(); // Cria um objeto roteador do Express para lidar com as rotas específicas definidas neste arquivo
const db = require("../db"); // Importa o módulo de acesso ao banco de dados (presumivelmente contendo funções para executar consultas SQL)

// Endpoint para criar um novo usuário
router.post("/", async (req, res) => {
  const { email, name } = req.body; // Extrai os dados da requisição do corpo da requisição

  // Validar entrada de dados
  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Inserir novo usuário no banco de dados
    const result = await db.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
      [email, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting into the database:", error);
    res.status(500).json({ error: "Error inserting into the database" });
  }
});

// Endpoint para obter um usuário por email
router.get("/", async (req, res) => {
  const { email } = req.query; // Extrai o parâmetro de consulta (query parameter) "email" da requisição

  // Validar entrada de dados
  if (!email || email.length < 5 || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Error querying the database" });
  }
});

// Endpoint para atualizar um usuário por email
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const { name } = req.body;

  // Validar entrada de dados
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
  } catch (error) {
    console.error("Error updating the database:", error);
    res.status(500).json({ error: "Error updating the database" });
  }
});

// Endpoint para deletar um usuário por email
router.delete("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM users WHERE email = $1 RETURNING *",
      [email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error("Error deleting from the database:", error);
    res.status(500).json({ error: "Error deleting from the database" });
  }
});

module.exports = router;
