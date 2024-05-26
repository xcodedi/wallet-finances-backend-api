// queries/users.js
const findUserByEmail = {
  text: "SELECT * FROM users WHERE email = $1",
  values: [], // Será preenchido dinamicamente
};

const insertUser = {
  text: "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
  values: [], // Será preenchido dinamicamente
};

const updateUserByEmail = {
  text: "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
  values: [], // Será preenchido dinamicamente
};

const deleteUserByEmail = {
  text: "DELETE FROM users WHERE email = $1 RETURNING *",
  values: [], // Será preenchido dinamicamente
};

module.exports = {
  findUserByEmail,
  insertUser,
  updateUserByEmail,
  deleteUserByEmail,
};
