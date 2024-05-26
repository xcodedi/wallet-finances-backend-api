// queries/categories.js
const getAllCategories = {
  text: "SELECT * FROM categories",
};

const findCategoryById = {
  text: "SELECT * FROM categories WHERE id = $1",
};

const addCategory = {
  text: "INSERT INTO categories (name) VALUES ($1) RETURNING *",
};

const deleteCategoryById = {
  text: "DELETE FROM categories WHERE id = $1 RETURNING *",
};

const updateCategoryById = {
  text: "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
};

module.exports = {
  getAllCategories,
  findCategoryById,
  addCategory,
  deleteCategoryById,
  updateCategoryById,
};
