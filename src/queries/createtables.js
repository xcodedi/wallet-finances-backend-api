const createTablesQueries = {
  createUsers: {
    text: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      )`,
  },
  createCategories: {
    text: `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      )`,
  },
  createFinances: {
    text: `CREATE TABLE IF NOT EXISTS finances (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INT,
        category_id INT,
        date DATE,
        title TEXT,
        value NUMERIC,
        email TEXT,
        CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_categories FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
      )`,
  },
};

module.exports = createTablesQueries; // Exporta o objeto contendo as queries para criação das tabelas
