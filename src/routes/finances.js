// Importa o framework Express para criar o servidor e definir rotas
const express = require("express");

// Cria um objeto roteador do Express para lidar com as rotas específicas definidas neste arquivo
const router = express.Router();

// Importa o módulo de acesso ao banco de dados (presumivelmente contendo funções para executar consultas SQL)
const db = require("../db");

// Endpoint para adicionar uma nova transação financeira
router.post("/", async (req, res) => {
  // Extrai os dados do corpo da requisição
  const { category_id, title, date, value, user_id, email } = req.body;

  // Loga o corpo da requisição no console para depuração
  console.log("Request Body:", req.body);

  // Valida se todos os campos obrigatórios foram fornecidos
  if (!category_id || !title || !date || !value || !user_id || !email) {
    return res.status(400).json({ error: "All fields are required" }); // Retorna um erro 400 se algum campo estiver ausente
  }

  try {
    // Consulta para verificar se o usuário com o e-mail fornecido existe no banco de dados
    const userQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const userResult = await db.query(userQuery);

    // Verifica se o usuário foi encontrado no banco de dados
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" }); // Retorna um erro 404 se o usuário não existir
    }

    // Insere uma nova transação financeira vinculada ao usuário
    const insertQuery = {
      text: "INSERT INTO finances (category_id, title, date, value, user_id, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [category_id, title, date, value, userResult.rows[0].id, email],
    };

    // Executa a consulta de inserção e armazena o resultado
    const result = await db.query(insertQuery);

    // Retorna a transação criada com status 201 (Criado)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Loga um erro se algo falhar ao inserir no banco de dados
    console.error("Error inserting into the database:", err);

    // Retorna um erro 500 (Erro Interno do Servidor)
    res.status(500).send("Error inserting into the database");
  }
});

// Endpoint para obter todas as transações financeiras de um usuário pelo email
router.get("/", async (req, res) => {
  // Extrai o parâmetro de consulta (query parameter) "email" da requisição
  const { email } = req.query;

  // Valida o e-mail fornecido
  if (!email || email.length < 5 || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" }); // Retorna erro 400 se o e-mail for inválido
  }

  try {
    // Consulta para buscar todas as transações financeiras associadas ao e-mail fornecido
    const query = {
      text: "SELECT * FROM finances WHERE email = $1",
      values: [email],
    };
    const result = await db.query(query);

    // Retorna todas as transações encontradas com status 200 (OK)
    res.status(200).json(result.rows);
  } catch (err) {
    // Loga um erro se algo falhar ao consultar o banco de dados
    console.error("Error querying the database:", err);

    // Retorna um erro 500 (Erro Interno do Servidor)
    res.status(500).send("Error querying the database");
  }
});

// Endpoint para atualizar uma transação financeira pelo ID
router.put("/:id", async (req, res) => {
  // Extrai o ID da transação dos parâmetros da URL
  const { id } = req.params;

  // Extrai os dados do corpo da requisição
  const { category_id, title, date, value, user_id } = req.body;

  // Obtém a chave de API do cabeçalho da requisição
  const apiKey = req.headers["x-api-key"];

  // Obtém o e-mail do cabeçalho da requisição
  const userEmail = req.headers["email"];

  // Valida a chave de API
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" }); // Retorna erro 401 se a API Key for inválida
  }

  // Valida se todos os campos obrigatórios foram fornecidos
  if (!category_id || !title || !date || !value || !user_id) {
    return res.status(400).json({ error: "All fields are required" }); // Retorna erro 400 se algum campo estiver ausente
  }

  try {
    // Consulta para atualizar a transação financeira no banco de dados
    const updateQuery = {
      text: "UPDATE finances SET category_id = $1, title = $2, date = $3, value = $4, user_id = $5, email = $6 WHERE id = $7 RETURNING *",
      values: [category_id, title, date, value, user_id, userEmail, id],
    };
    const result = await db.query(updateQuery);

    // Verifica se alguma linha foi atualizada
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Finance not found" }); // Retorna erro 404 se a transação não for encontrada
    }

    // Retorna a transação atualizada com status 200 (OK)
    res.status(200).json(result.rows[0]);
  } catch (err) {
    // Loga um erro se algo falhar ao atualizar o banco de dados
    console.error("Error updating the database:", err);

    // Retorna um erro 500 (Erro Interno do Servidor)
    res.status(500).send("Error updating the database");
  }
});

// Endpoint para deletar uma transação financeira pelo ID
router.delete("/:id", async (req, res) => {
  // Extrai o ID da transação dos parâmetros da URL
  const { id } = req.params;

  // Obtém a chave de API do cabeçalho da requisição
  const apiKey = req.headers["x-api-key"];

  // Valida a chave de API
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" }); // Retorna erro 401 se a API Key for inválida
  }

  try {
    // Consulta para deletar a transação financeira pelo ID
    const deleteQuery = {
      text: "DELETE FROM finances WHERE id = $1 RETURNING *",
      values: [id],
    };
    const result = await db.query(deleteQuery);

    // Verifica se alguma linha foi deletada
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Finance not found" }); // Retorna erro 404 se a transação não for encontrada
    }

    // Retorna mensagem de sucesso com status 200 (OK)
    res.status(200).json({ message: "Finance successfully deleted" });
  } catch (err) {
    // Loga um erro se algo falhar ao deletar do banco de dados
    console.error("Error deleting from the database:", err);

    // Retorna um erro 500 (Erro Interno do Servidor)
    res.status(500).send("Error deleting from the database");
  }
});

// Exporta o roteador para ser usado em outros arquivos
module.exports = router;
