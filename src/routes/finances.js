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
    const { category_id, title, date, value, user_id } = req.body;

    // Verificar se todos os campos estão presentes
    if (!email || !category_id || !title || !date || !value || !user_id) {
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
      text: "INSERT INTO finances (category_id, title, date, value, email, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [category_id, title, date, value, email, user_id],
    };
    const insertResult = await db.query(insertQuery);

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers;

    // Validar se o ID foi fornecido
    if (!id) {
      return res.status(400).json({ error: "ID is mandatory" });
    }

    // Validar email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
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

    // Verificar se o registro financeiro existe e pertence ao usuário
    const financeQuery = {
      text: "SELECT * FROM finances WHERE id = $1 AND email = $2",
      values: [id, email],
    };
    const financeResult = await db.query(financeQuery);
    if (financeResult.rows.length === 0) {
      return res.status(404).json({
        error:
          "Finance record not found or you do not have permission to delete this record",
      });
    }

    // Excluir o registro financeiro
    const deleteQuery = {
      text: "DELETE FROM finances WHERE id = $1 RETURNING *",
      values: [id],
    };
    const deleteResult = await db.query(deleteQuery);

    res.status(200).json({
      message: "Finance record deleted successfully",
      deletedRecord: deleteResult.rows[0],
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email } = req.headers;
    const { date } = req.query;

    // Validação dos parâmetros
    if (!email || !date) {
      // Remoção da validação de month e year
      return res.status(400).json({ error: "Email and date are required" });
    }

    // Validar o formato da data
    if (!validateDate(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Obter o user_id com base no email
    const userQuery = {
      text: "SELECT id FROM users WHERE email = $1",
      values: [email],
    };
    const userResult = await db.query(userQuery);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user_id = userResult.rows[0].id;

    // Ajustar a consulta SQL para a data específica
    const financesQuery = {
      text: `
        SELECT fin.title, fin.value, fin.date, fin.user_id, fin.category_id, cat.name
        FROM finances AS fin
        JOIN categories AS cat
        ON fin.category_id = cat.id
        WHERE fin.user_id = $1 AND fin.date = $2 -- Alteração para usar a data específica
        ORDER BY fin.date ASC;
      `,
      values: [user_id, date], // Passar a data como parâmetro
    };

    const financesResult = await db.query(financesQuery);

    res.status(200).json(financesResult.rows);
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
