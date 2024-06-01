const db = require("../db"); // Importa o módulo de banco de dados

const getAllCategories = async () => {
  try {
    const categoryResult = await db.query("SELECT * FROM categories"); // Consulta todas as categorias
    return categoryResult.rows; // Retorna todas as linhas de categorias
  } catch (error) {
    console.error("Error querying categories:", error); // Loga um erro se houver um problema na consulta
    throw error; // Lança o erro para ser tratado externamente
  }
};

const findCategoryById = async (categoryId) => {
  try {
    const categoryResult = await db.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    ); // Consulta uma categoria pelo ID
    return categoryResult.rows[0]; // Retorna a primeira linha do resultado
  } catch (error) {
    console.error("Error querying category by ID:", error); // Loga um erro se houver um problema na consulta
    throw error; // Lança o erro para ser tratado externamente
  }
};

const addCategory = async (categoryName) => {
  try {
    const categoryResult = await db.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [categoryName]
    ); // Adiciona uma nova categoria
    return categoryResult.rows[0]; // Retorna a nova categoria adicionada
  } catch (error) {
    console.error("Error adding category:", error); // Loga um erro se houver um problema ao adicionar
    throw error; // Lança o erro para ser tratado externamente
  }
};

const deleteCategoryById = async (categoryId) => {
  try {
    const categoryResult = await db.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [categoryId]
    ); // Deleta uma categoria pelo ID
    return categoryResult.rows[0]; // Retorna a categoria deletada
  } catch (error) {
    console.error("Error deleting category by ID:", error); // Loga um erro se houver um problema ao deletar
    throw error; // Lança o erro para ser tratado externamente
  }
};

const updateCategoryById = async (categoryName, categoryId) => {
  try {
    const categoryResult = await db.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [categoryName, categoryId]
    ); // Atualiza uma categoria pelo ID
    return categoryResult.rows[0]; // Retorna a categoria atualizada
  } catch (error) {
    console.error("Error updating category by ID:", error); // Loga um erro se houver um problema na atualização
    throw error; // Lança o erro para ser tratado externamente
  }
};

module.exports = {
  getAllCategories, // Exporta a função para obter todas as categorias
  findCategoryById, // Exporta a função para encontrar uma categoria pelo ID
  addCategory, // Exporta a função para adicionar uma nova categoria
  deleteCategoryById, // Exporta a função para deletar uma categoria pelo ID
  updateCategoryById, // Exporta a função para atualizar uma categoria pelo ID
};
