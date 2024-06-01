const db = require("../db"); // Importa o módulo de banco de dados

const findUserByEmail = async (email) => {
  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]); // Consulta um usuário pelo email
    return userResult.rows[0]; // Retorna a primeira linha do resultado
  } catch (error) {
    console.error("Error querying user by email:", error); // Loga um erro se houver um problema na consulta
    throw error; // Lança o erro para ser tratado externamente
  }
};

const insertUser = async (email, name) => {
  try {
    const userResult = await db.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
      [email, name]
    ); // Insere um novo usuário
    return userResult.rows[0]; // Retorna o novo usuário inserido
  } catch (error) {
    console.error("Error inserting user:", error); // Loga um erro se houver um problema ao inserir
    throw error; // Lança o erro para ser tratado externamente
  }
};

const updateUserByEmail = async (name, email) => {
  try {
    const userResult = await db.query(
      "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
      [name, email]
    ); // Atualiza o nome de um usuário pelo email
    return userResult.rows[0]; // Retorna o usuário atualizado
  } catch (error) {
    console.error("Error updating user by email:", error); // Loga um erro se houver um problema na atualização
    throw error; // Lança o erro para ser tratado externamente
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const userResult = await db.query(
      "DELETE FROM users WHERE email = $1 RETURNING *",
      [email]
    ); // Deleta um usuário pelo email
    return userResult.rows[0]; // Retorna o usuário deletado
  } catch (error) {
    console.error("Error deleting user by email:", error); // Loga um erro se houver um problema ao deletar
    throw error; // Lança o erro para ser tratado externamente
  }
};

module.exports = {
  findUserByEmail, // Exporta a função para encontrar um usuário pelo email
  insertUser, // Exporta a função para inserir um novo usuário
  updateUserByEmail, // Exporta a função para atualizar um usuário pelo email
  deleteUserByEmail, // Exporta a função para deletar um usuário pelo email
};
