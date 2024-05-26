const express = require("express");
const router = express.Router();
const db = require("../db");
const categoriesQueries = require("../queries/categories");
const usersqueries = require("../queries/users");

// Função para validar email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar data (formato YYYY-MM-DD)
const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

// Função para validar valor (deve ser um número)
const validateValue = (value) => {
  return !isNaN(value);
};

router.post("/", async (req, res) => {
  try {
    const { email } = req.headers;
    const { category_id, title, date, value } = req.body;

    // Verificar se todos os campos estão presentes
    if (!email || !category_id || !title || !date || !value) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validar email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validar título (mínimo 3 caracteres)
    if (title.length < 3) {
      return res
        .status(400)
        .json({ error: "Title should have more than 3 characters" });
    }

    // Validar data
    if (!validateDate(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Validar valor
    if (!validateValue(value)) {
      return res.status(400).json({ error: "Value must be a number" });
    }

    // Verificar se o usuário existe
    const userQuery = {
      text: usersqueries.findUserByEmail.text,
      values: [email],
    };
    const userResult = await db.query(userQuery);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar se a categoria existe
    const categoryQuery = {
      text: categoriesQueries.findCategoryById.text,
      values: [category_id],
    };
    const categoryResult = await db.query(categoryQuery);
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Inserir os dados na tabela
    const insertQuery = {
      text: "INSERT INTO finances (category_id, title, date, value, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      values: [category_id, title, date, value, email],
    };
    const insertResult = await db.query(insertQuery);

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
