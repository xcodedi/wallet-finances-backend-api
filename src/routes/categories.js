// Importa o módulo 'express' para criar rotas
const express = require("express");
// Cria um novo roteador usando o express.Router()
const router = express.Router();
// Importa o módulo 'db' que contém as funções de consulta ao banco de dados
const db = require("../db");

// Endpoint para obter todas as categorias
router.get("/", async (req, res) => {
  try {
    // Tenta buscar todas as categorias do banco de dados
    const result = await db.query("SELECT * FROM categories");
    // Retorna as categorias encontradas em formato JSON
    res.status(200).json(result.rows);
  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro interno do servidor
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para obter uma categoria pelo ID
router.get("/:id", async (req, res) => {
  try {
    // Obtém o ID da categoria da requisição
    const { id } = req.params;
    // Tenta buscar a categoria com o ID fornecido no banco de dados
    const result = await db.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    // Se a categoria não for encontrada, retorna um erro 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    // Retorna a categoria encontrada em formato JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro interno do servidor
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para adicionar uma nova categoria
router.post("/", async (req, res) => {
  // Obtém o nome da categoria da requisição
  const { name } = req.body;
  // Registra no console a solicitação recebida
  console.log("Received request to add category:", name);
  // Verifica se o nome da categoria foi fornecido
  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }
  try {
    // Insere a nova categoria no banco de dados e retorna a categoria adicionada em formato JSON
    const result = await db.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro interno do servidor
    console.error("Error inserting into the database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para atualizar uma categoria pelo ID
router.put("/:id", async (req, res) => {
  try {
    // Obtém o ID da categoria da requisição
    const { id } = req.params;
    // Obtém o novo nome da categoria da requisição
    const { name } = req.body;
    // Verifica se o nome da categoria foi fornecido
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    // Atualiza a categoria com o ID fornecido no banco de dados e retorna a categoria atualizada em formato JSON
    const result = await db.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    // Se a categoria não for encontrada, retorna um erro 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro interno do servidor
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para deletar uma categoria pelo ID
router.delete("/:id", async (req, res) => {
  // Obtém o ID da categoria da requisição
  const { id } = req.params;
  // Registra no console a solicitação recebida
  console.log("Received request to delete category with id:", id);
  // Verifica se o ID da categoria foi fornecido
  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }
  try {
    // Deleta a categoria com o ID fornecido do banco de dados e retorna a categoria excluída em formato JSON
    const result = await db.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    // Se a categoria não for encontrada, retorna um erro 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro interno do servidor
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Exporta o roteador contendo os endpoints para manipulação de categorias
module.exports = router;
