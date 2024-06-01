// Importa o framework Express para criar o servidor e definir rotas
const express = require("express");
// Cria um objeto roteador do Express para lidar com as rotas específicas definidas neste arquivo
const router = express.Router();
// Importa o módulo de acesso ao banco de dados (presumivelmente contendo funções para executar consultas SQL)
const db = require("../db");

// Endpoint para adicionar uma nova transação financeira
router.post("/", async (req, res) => {
  // Extrai os dados da requisição do corpo da requisição
  const { category_id, title, date, value, user_id, email } = req.body;

  // Validar entrada de dados
  if (!category_id || !title || !date || !value || !user_id || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Verificar se o usuário com o e-mail fornecido existe no banco de dados
    const userQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const userResult = await db.query(userQuery);

    // Se o usuário não for encontrado, retornar erro
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Se o usuário existir, inserir a transação financeira na tabela com o ID do usuário e o e-mail
    const insertQuery = {
      text: "INSERT INTO finances (category_id, title, date, value, user_id, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [category_id, title, date, value, userResult.rows[0].id, email],
    };
    const result = await db.query(insertQuery);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting into the database:", err);
    res.status(500).send("Error inserting into the database");
  }
});

// Endpoint para obter todas as transações financeiras de um usuário pelo email
router.get("/", async (req, res) => {
  // Extrai o parâmetro de consulta (query parameter) "email" da requisição
  const { email } = req.query;

  // Validar entrada de dados
  if (!email || email.length < 5 || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const query = {
      text: "SELECT * FROM finances WHERE email = $1",
      values: [email],
    };
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Error querying the database");
  }
});

// Endpoint para atualizar uma transação financeira pelo ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { category_id, title, date, value, user_id } = req.body;
  const apiKey = req.headers["x-api-key"];
  const userEmail = req.headers["email"]; // Adicionando a captura do e-mail do header

  // Validar API Key
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  // Validar entrada de dados
  if (!category_id || !title || !date || !value || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updateQuery = {
      text: "UPDATE finances SET category_id = $1, title = $2, date = $3, value = $4, user_id = $5, user_email = $6 WHERE id = $7 RETURNING *",
      values: [category_id, title, date, value, user_id, userEmail, id], // Incluindo userEmail nos valores da query
    };
    const result = await db.query(updateQuery);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Finance not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating the database:", err);
    res.status(500).send("Error updating the database");
  }
});

// Endpoint para deletar uma transação financeira pelo ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const apiKey = req.headers["x-api-key"];

  // Validar API Key
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  try {
    const deleteQuery = {
      text: "DELETE FROM finances WHERE id = $1 RETURNING *",
      values: [id],
    };
    const result = await db.query(deleteQuery);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Finance not found" });
    }

    res.status(200).json({ message: "Finance successfully deleted" });
  } catch (err) {
    console.error("Error deleting from the database:", err);
    res.status(500).send("Error deleting from the database");
  }
});

module.exports = router;
